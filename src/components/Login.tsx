import { useContext, useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { IdentityContext } from "../providers/IdentityProvider"
import { IdentityContextType, IdentityType } from "../types/IdentityType"
import { defaultProfile, defaultRelays, defaultContacts, getMyProfile, getMyRelays, getMyContacts, pool, getRelayList } from "../libraries/Nostr"
import { Spinner } from './Spinner'
import { Event, UnsignedEvent, getEventHash, getSignature } from "nostr-tools"
import { decryptPrivateKey } from "../libraries/EncryptAndStoreLocal"
import { RelayList } from "../types/NostrRelay"

const publishNewProfile = async (newProfile: IdentityType, skipConf = false) => {

  if (!skipConf) {
    if (!confirm('Would you like to populate your profile so it isn\'t empty? You can edit it later on any nostr app.')) return
  }

  const profileEvent: UnsignedEvent = {
    kind: 0,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    content: JSON.stringify({
      name: newProfile.name,
      about: newProfile.about,
      picture: newProfile.picture,
    }),
    pubkey: newProfile.pubkey
  }

  const helloWorldNote: UnsignedEvent = {
    kind: 1,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    content: "running Yondar 🌍",
    pubkey: newProfile.pubkey
  }

  const profileId = getEventHash(profileEvent)
  const noteId = getEventHash(helloWorldNote)
  let profileSig
  let noteSig
  try {
    const sec = await decryptPrivateKey('signing')
    if (!sec) {
      // publishNewProfile(newProfile, true)
      throw "Failed to decrypt private key"
    }
    profileSig = getSignature(profileEvent, sec)
    noteSig = getSignature(helloWorldNote, sec)
  } catch (e) {
    console.log(e)
    return
  }
  const signedEvent: Event = {
    ...profileEvent,
    id: profileId,
    sig: profileSig
  }
  const signedNote: Event = {
    ...helloWorldNote,
    id: noteId,
    sig: noteSig
  }
  const relayList: RelayList = getRelayList(defaultRelays, ['read'])
  console.log('publishing', signedEvent, signedNote)
  const signedEventPub = pool.publish(relayList, signedEvent)
  const signedNotePub = pool.publish(relayList, signedNote)
  console.log(signedEventPub, signedNotePub)
}

export const Login = () => {
  const [loading, setLoading] = useState(false)
  const {identity, setIdentity, isIdentityFresh, setRelays, setContacts} = useContext<IdentityContextType>(IdentityContext)
  const [isNewProfile, setIsNewProfile] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const loadProfile = async () => {
      // retrieve profile
      const loadedProfile = await getMyProfile(identity.pubkey)
      if (loadedProfile === defaultProfile) {
        // no profile found. use default as template but add pubkey
        const newProfile = {...defaultProfile, pubkey: identity.pubkey, last_updated: +new Date()}
        setIdentity(newProfile)
        setIsNewProfile(true)
      } else {
        const profile = {...loadedProfile, pubkey: identity.pubkey, last_updated: +new Date()}
        setIdentity(profile)
      }
      // retrieve relays
      const loadedRelays = await getMyRelays(identity.pubkey)
      if (loadedRelays !== defaultRelays) {
        setRelays(loadedRelays)
      }
      const loadedContacts = await getMyContacts(identity.pubkey)
      if (loadedContacts !== defaultContacts) {
        setContacts(loadedContacts)
      }
    }
    // redirect to homepage if login page is accessed with no identity
    if (!identity) {
      navigate('/')
    } else if (isIdentityFresh()) {
      // profile is still fresh. redirect to dashboard
      if (isNewProfile) {
        publishNewProfile(identity)
        setIsNewProfile(false)
      }
      navigate('/dashboard')
    } else {
      // proceed with loading profile
      setLoading(true)
      loadProfile()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity,navigate /* isIdentityFresh, setIdentity, setRelays are ok to exclude */])

  return (
    <div id="login">
      <h1>Logging In...</h1>
      <label>With public key</label>
      <p>{identity ? identity.pubkey : null}</p>
      {loading ? <Spinner/> : null}
    </div>
  )
}