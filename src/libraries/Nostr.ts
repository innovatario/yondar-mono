import { SimplePool, Filter, Sub, Event, nip19 } from "nostr-tools"
import { IdentityType } from "../types/IdentityType"
import { RelayList, RelayObject, RelayReadWrite, FilterReadWrite } from "../types/NostrRelay"
import { ContactObject } from "../types/NostrContact"

const readWrite: RelayReadWrite = {read: true, write: true}

export const defaultRelays: RelayObject = {
  'wss://yondar.nostr1.com': readWrite,
  'wss://relay.primal.net': readWrite,
  'wss://relay.damus.io': readWrite,
  'wss://nos.lol': readWrite,
  'wss://relay.nostr.band': readWrite,
}

export const defaultProfile: IdentityType = {
  'name': 'a lone Yondarer',
  'about': 'Just Yondaring about the world. I\'m new to nostr and haven\'t set up my profile yet. Check out https://go.yondar.me',
  'picture': 'https://yondar-user-content.s3.us-east-2.amazonaws.com/android-chrome-256x256.png',
  'username': 'a lone Yondarer',
  'display_name': 'a lone Yondarer',
  'displayName': 'a lone Yondarer',
  'nip05': '',
  'pubkey': '0000000000000000000000000000000000000000000000000000000000000000',
}

export const defaultContacts: ContactObject = {}

export const pool = new SimplePool()

type EventsByKind = {
  [key: number]: Event[]
}

// write a properly typed getTag function to pass into the find method that takes a tag string and returns the value for that key
type FindTag = (tag: string[], i: number, o: string[][]) => boolean;
export const getTag = (key: string): FindTag => {
  return (tag): boolean => {
    return tag && Array.isArray(tag) && tag[0] === key
  }
}

/**
 * 
 * @param relays RelayObject
 * @param requireReadWrite FilterReadWrite - array of 'read' and/or 'write'. If you specify 'read' and the relay's 'read' is true, it will be included in the array. If you specify 'read' and 'write', then the relay's 'read' and 'write' must both be true for it to be included in the array.
 */
export const getRelayList = (relays: RelayObject, requireReadWrite?: FilterReadWrite): RelayList => {
  const relayList: RelayList = []
  for (const [relay, rw] of Object.entries(relays)) {
    if (!requireReadWrite || requireReadWrite.every(r => rw[r])) {
      relayList.push(relay)
    }
  }
  if (relayList.length === 0) {
    console.warn('No relays found that match the specified read/write requirements.')
  }
  return relayList
}

export const getAll = async (pubkey: string[] | undefined, kinds: number[], relays: RelayObject = defaultRelays) => {
  const filter: Filter<number> = {kinds: [...kinds], authors: pubkey}
  const relayList: RelayList = getRelayList(relays, ['read'])
  const sub: Sub = pool.sub(relayList,[filter])
  const events: EventsByKind = {}
  sub.on('event', event => {
    events[event.kind].push(event)
  })
  const all = await new Promise<EventsByKind>((resolve) => {
    sub.on('eose', () => {
      // find most recent kind event
      resolve(events)
    })
  })
  return all
}

export const getMostRecent = async (pubkey: string, kinds: number[], relays: RelayObject = defaultRelays): Promise<Event | null> => {
  if (kinds.length > 1) console.warn('getMostRecent will only return the single most recent event of all supplied kinds.')
  const filter: Filter<number> = {kinds: [...kinds], authors: [pubkey]}
  const relayList: RelayList = getRelayList(relays, ['read'])
  const sub: Sub = pool.sub(relayList,[filter])
  const kind: Event[] = []
  sub.on('event', event => {
    if (typeof event.created_at === 'number') {
      kind.push(event)
    } else {
      console.warn('event.created_at is not a number',event)
    }
  })
  try {
    const mostRecent = await new Promise<Event|null>((resolve,reject)  => {
      sub.on('eose', () => {
        // find most recent kind event
        if (kind.length === 0) {
          reject(null)
        } else {
          const mostRecent = kind.reduce((a, b) => a.created_at > b.created_at ? a : b)
          resolve(mostRecent)
        }
        sub.unsub()
      })
    })
    return mostRecent
  } catch (e) {
    console.warn('Failed to get most recent events.',kinds, pubkey)
    return null
  }
}

export const getMyRelays = async (pubkey: string): Promise<RelayObject> => {
  const myMetadata = await getMostRecent(pubkey,[3])
  if (!myMetadata) return defaultRelays
  try {
    return JSON.parse(myMetadata.content) as RelayObject
  } catch (e) {
    console.warn('Failed to parse relays from user metadata. Keeping default relay set.')
    return defaultRelays
  }
}

export const getMyProfile = async (pubkey: string): Promise<IdentityType> => {
  const myProfile = await getMostRecent(pubkey,[0])
  if (!myProfile) return defaultProfile
  try {
    const parsedProfile = JSON.parse(myProfile.content) as IdentityType
    return Object.assign({}, parsedProfile, {pubkey})
  } catch (e) {
    console.warn('Failed to parse profile from user metadata.')
    return defaultProfile
  }
}

export const getMyContacts = async (pubkey: string): Promise<ContactObject> => {
  const myContacts = await getMostRecent(pubkey,[3])
  if (!myContacts) return defaultContacts
  try {
    const parsedContacts: ContactObject = {}
    myContacts.tags.forEach(tag => {
      if (tag[0] === 'p' && typeof tag[1] === 'string' && tag[1].length === 64) {
        parsedContacts[tag[1]] = {relay: null, petname: null}
        if (typeof tag[2] === 'string' && tag[2].indexOf('wss://') === 0) {
          parsedContacts[tag[1]].relay = tag[2]
        }
        if (typeof tag[3] === 'string') {
          parsedContacts[tag[1]].petname = tag[3]
        }
      }
    })
    return parsedContacts
  } catch (e) {
    console.warn('Failed to parse contacts from user metadata.')
    return defaultContacts
  }
}

export function isValidNpub(param: string) {
  if (param === '') return false
  if (param?.match(/^[a-f0-9]{64}$/)) return false
  if (param !== undefined){
    try {
      if (nip19.decode(param).type === 'npub') return true
    } catch (error) {
      console.error('Error decoding not valid npub:', error)
      return false
    }
  }
  return false
}