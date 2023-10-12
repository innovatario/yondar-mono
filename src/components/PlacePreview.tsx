import { useState, useEffect, useContext } from 'react'
import { getRelayList, getTag, pool } from "../libraries/Nostr"
import { NaddrContext } from '../providers/NaddrProvider'
import { Filter, nip19 } from 'nostr-tools'
import { RelayList } from '../types/NostrRelay'
import { IdentityContextType } from '../types/IdentityType'
import { IdentityContext } from '../providers/IdentityProvider'

export const PlacePreview = () => {
  const { naddr } = useContext(NaddrContext)
  const { relays } = useContext<IdentityContextType>(IdentityContext)
  const [place, setPlace] = useState<Place | null>(null)

  useEffect(() => {
    const getPlace = async () => {
      let decodedNaddr
      if (naddr) {
        decodedNaddr = nip19.decode(naddr).data
        const { kind, pubkey, identifier } = decodedNaddr as nip19.AddressPointer
        const filter: Filter<37515> = { kinds: [37515], authors: [pubkey], "#d": [identifier]}
        const relayList: RelayList = getRelayList(relays, ['read'])
        const place = await pool.list(relayList, [filter])
        // sub.on('event', (event) => {
        //   console.log('place event', event)
        // })
        // console.log('preview', relayList, filter)
        // if there are multiples, sort by created_at and take the most recent
        const only = place.sort((a,b) => b.created_at - a.created_at)[0]
        try {
          only.content = JSON.parse(only.content)
          setPlace(only)
        } catch (e) {
          console.log('error', e)
        }
      } else {
        console.log('no naddr')
      }
    }
    getPlace()
  },[naddr, relays])

  return (
    <div className="component-placepreview">
      {place?.content?.properties?.name}
    </div>
  )
}