import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IdentityContextType, IdentityType } from "../types/IdentityType"
import { IdentityContext } from "../providers/IdentityProvider"
import { getPublicKey } from "../libraries/NIP-07"
import { defaultProfile, defaultRelays, defaultContacts, getMyProfile, getMyRelays, getMyContacts, pool, getRelayList } from "../libraries/Nostr"
import { Event, UnsignedEvent, getEventHash, getSignature } from 'nostr-tools'
import { decryptPrivateKey } from '../libraries/EncryptAndStoreLocal'
import { RelayList } from '../types/NostrRelay'

export const SignInButton = () => {
  const [loading, setLoading] = useState(false)
  const {identity, setIdentity, isIdentityFresh, setRelays, setContacts} = useContext<IdentityContextType>(IdentityContext)
  const [isNewProfile, setIsNewProfile] = useState(false)

  const signIn = async () => {
    // trigger sign in with extension
    const success = await getPublicKey()
    if (success) {
      // store pubkey in identity provider
      setIdentity({pubkey: success})
      // redirect to account page
    } else {
      // trigger "key not set up yet" dialog
    }
  }


  const publishNewProfile = async (newProfile: IdentityType, skipConf = false) => {

    if (!skipConf) {
      if (!confirm('Would you like to populate your profile so it isn\'t empty? You can edit it later on any nostr app.')) return
    }

    const relaysEvent: UnsignedEvent = {
      kind: 3,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: JSON.stringify(defaultRelays),
      pubkey: newProfile.pubkey
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

    const relayId = getEventHash(relaysEvent)
    const profileId = getEventHash(profileEvent)
    const noteId = getEventHash(helloWorldNote)
    let relaySig
    let profileSig
    let noteSig
    try {
      const sec = await decryptPrivateKey('signing')
      if (!sec) {
        // publishNewProfile(newProfile, true)
        throw "Failed to decrypt private key"
      }
      relaySig = getSignature(relaysEvent, sec)
      profileSig = getSignature(profileEvent, sec)
      noteSig = getSignature(helloWorldNote, sec)
    } catch (e) {
      console.log(e)
      return
    }
    const signedRelays: Event = {
      ...relaysEvent,
      id: relayId,
      sig: relaySig
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
    const relayList: RelayList = getRelayList(defaultRelays, ['write'])
    console.log('publishing', signedRelays, signedEvent, signedNote)
    const signedRelaysPub = pool.publish(relayList, signedRelays)
    const signedEventPub = pool.publish(relayList, signedEvent)
    const signedNotePub = pool.publish(relayList, signedNote)
    console.log(signedRelaysPub, signedEventPub, signedNotePub)
  }

  useEffect(() => {
    console.log('useEffect run')
    const loadProfile = async () => {
      // retrieve profile
      const loadedProfile = await getMyProfile(identity.pubkey)
      if (loadedProfile === defaultProfile) {
        console.log('no profile found, using defaultProfile')
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
    if (isIdentityFresh()) {
      // profile is still fresh. redirect to dashboard
      if (isNewProfile) {
        publishNewProfile(identity)
        setIsNewProfile(false)
      }
    } else {
      // proceed with loading profile
      setLoading(true)
      loadProfile()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity?.pubkey])
  
  if (identity) {
    return
  } else {
    return (
      <>
        <button type='button' onClick={signIn}>Sign in with NIP-07 Extension</button>
      </>
    )
  }
}