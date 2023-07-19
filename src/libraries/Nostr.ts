import { SimplePool, Filter, Sub, Event } from "nostr-tools"
import { IdentityType } from "../types/IdentityType"

export const defaultRelays = [
  'wss://yondar.nostr1.com',
  'wss://relay.primal.net'
]

export const defaultProfile: IdentityType = {
  'name': 'unknown',
  'username': 'unknown',
  'display_name': 'unknown',
  'displayName': 'unknown',
  'nip05': 'unknown',
  'pubkey': '0000000000000000000000000000000000000000000000000000000000000000'
}

export const pool = new SimplePool()

type EventsByKind = {
  [key: number]: Event[]
}

export const getAll = async (pubkey: string[] | undefined, kinds: number[], relays: string[] = defaultRelays) => {
  const filter: Filter<number> = {kinds: [...kinds], authors: pubkey}
  const sub: Sub = pool.sub(relays,[filter])
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

export const getMostRecent = async (pubkey: string, kinds: number[], relays: string[] = defaultRelays) => {
  if (kinds.length > 1) console.warn('getMostRecent will only return the single most recent event of all supplied kinds.')
  const filter: Filter<number> = {kinds: [...kinds], authors: [pubkey]}
  const sub: Sub = pool.sub(relays,[filter])
  const kind: Event[] = []
  sub.on('event', event => {
    if (typeof event.created_at === 'number') {
      kind.push(event)
    } else {
      console.warn('event.created_at is not a number',event)
    }
  })
  try {
    const mostRecent = await new Promise<Event>((resolve,reject)  => {
      sub.on('eose', () => {
        // find most recent kind event
        if (kind.length === 0) {
          reject('No events found.')
        } else {
          const mostRecent = kind.reduce((a, b) => a.created_at > b.created_at ? a : b)
          resolve(mostRecent)
        }
      })
    })
    return mostRecent
  } catch (e) {
    console.warn('Failed to get most recent events.',kinds, pubkey)
    return []
  }
}

export const getMyRelays = async (pubkey: string) => {
  const myMetadata = await getMostRecent(pubkey,[3])
  try {
    return JSON.parse(myMetadata.content)
  } catch (e) {
    console.warn('Failed to parse relays from user metadata. Keeping default relay set.')
    return defaultRelays
  }
}

export const getMyProfile = async (pubkey: string): Promise<IdentityType> => {
  const myProfile = await getMostRecent(pubkey,[0])
  try {
    const parsedProfile = JSON.parse(myProfile.content) as IdentityType
    return Object.assign({}, parsedProfile, {pubkey})
  } catch (e) {
    console.warn('Failed to parse profile from user metadata.')
    return defaultProfile
  }
}