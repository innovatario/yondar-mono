import React, { useContext, useEffect, useState } from "react"
import { defaultProfile, getMyProfile } from "../libraries/Nostr"
import { nip19 } from "nostr-tools"
import { AccountProfile } from "./AccountProfile"
import { IdentityContextType, IdentityType } from "../types/IdentityType"
import { useMap } from "react-map-gl"
import { useNavigate } from "react-router-dom"
import { WavyText } from "./WavyText"
import { IdentityContext } from "../providers/IdentityProvider"
import "../scss/ViewProfile.scss"
import { SignInButton } from "./SignInButton"
import { WipeIdentityButton } from "./WipeIdentityButton"

interface ViewProfileProps {
  npub?: string;
}

export const ViewProfile = ({ npub }: ViewProfileProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [metadata, setMetadata] = useState<IdentityType | null>(null)
  const { identity, setIdentity } = useContext<IdentityContextType>(IdentityContext)
  const pubkey = npub ? npub : identity?.pubkey
  const hex = npub ? nip19.decode(npub).data.toString() : pubkey
  const { current: map } = useMap()

  useEffect(() => {
    map && console.log("zoom out")
    map &&
      map.flyTo({
        zoom: 15.5,
        duration: 1000,
      })
  }, [map])

  useEffect(() => {
    if (pubkey) {
      if (identity.pubkey === pubkey && Object.keys(identity).length > 1) {
        // load the profile from the identity context
        setMetadata(identity)
      } else {
        // fetch the profile from the network
        const getUserProfile = async () => {
          try {
            setLoading(true)
            const loadedProfile = await getMyProfile(hex as string)
            const profile = { ...defaultProfile, ...loadedProfile, pubkey: identity.pubkey, last_updated: +new Date()}
            if (identity.pubkey === profile.pubkey) {
              // Update the identity context with the profile
              setIdentity(profile)
            }
            setMetadata(profile)
          } catch (error) {
            console.error("Error decoding npub:", error)
            // Handle the error as needed
          } finally {
            setLoading(false)
          }
        }
        getUserProfile()
      }
    }
  }, [hex])

  const [toggle, setToggle] = useState<boolean>(true)

  const handleLink = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    if (!metadata) return
    const npub = nip19.npubEncode(metadata.pubkey)
    window.open(`https://njump.me/${npub}`, "_blank", "noopener noreferrer")
  }

  const profile = (
    <>
    <div className="component-viewprofile">
      {loading ? (
        <div className="loading">
          <WavyText text="Loading Profile ..." />
        </div>
      ) : (
        <>
          {metadata ? <AccountProfile identity={metadata} /> : null}
        </>
      )}
      <button onClick={handleLink}>View more on njump.me</button>
      {identity?.pubkey === metadata?.pubkey ? <WipeIdentityButton/> : null}
    </div>
    </>
  )

  return (
    <>
      {pubkey ? profile : <SignInButton />}
    </>
  )
}
