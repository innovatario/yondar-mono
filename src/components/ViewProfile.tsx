import React, { useContext, useEffect, useState } from "react"
import { getMyProfile } from "../libraries/Nostr"
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
  const [metadata, setMetadata] = useState<IdentityType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const { identity } = useContext<IdentityContextType>(IdentityContext)
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
      const getUserProfile = async () => {
        try {
          setLoading(true)
          const loadedProfile = await getMyProfile(hex as string)
          setMetadata(loadedProfile)
        } catch (error) {
          console.error("Error decoding npub:", error)
          // Handle the error as needed
        } finally {
          setLoading(false)
        }
      }
      getUserProfile()
    }
  }, [hex])

  const [toggle, setToggle] = useState<boolean>(true)

  const doToggle = () => {
    setToggle(!toggle)
    navigate("/dashboard")
  }

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
      <WipeIdentityButton/>
    </div>
    </>
  )

  return (
    <>
      {pubkey ? profile : <SignInButton />}
    </>
  )
}
