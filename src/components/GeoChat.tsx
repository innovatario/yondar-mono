import { useEffect, useContext, useReducer } from 'react'
import '../scss/GeoChat.scss'
import { useGeolocationData } from '../hooks/useGeolocationData'
import Geohash from 'latlon-geohash'
import { getRelayList, getTag, pool } from '../libraries/Nostr'
import { RelayList } from '../types/NostrRelay'
import { Filter } from 'nostr-tools'
import { IdentityContextType } from '../types/IdentityType'
import { IdentityContext } from '../providers/IdentityProvider'
import { chatsReducer } from '../reducers/ChatsReducer'

export const GeoChat = ({ show, mapLngLat}: {show: boolean, mapLngLat: number[]}) => {
  const {cursorPosition} = useGeolocationData()
  const { relays } = useContext<IdentityContextType>(IdentityContext)
  const [chats, chatsDispatch] = useReducer(chatsReducer, [])

  const lnglat = cursorPosition ? [cursorPosition.lng, cursorPosition.lat] : mapLngLat 
  const hash = Geohash.encode(lnglat[1], lnglat[0], 5)

  useEffect(() => {
    // get kind1 notes tagged with the current geohash
    const filters: Filter[] = []
    for( let i = 0; i < hash.length; i++ ) {
      filters.push({kinds: [1], "#g": [hash.slice(0, i + 1)]})
    }
    const relayList: RelayList = getRelayList(relays, ['read'])
    const sub = pool.sub(relayList, [filters[4]])
    sub.on('event', (event) => {
      chatsDispatch({type: 'add', payload: event})
    })
  }, [mapLngLat])

  const chatList = chats.map((chat, index) => {
    let geohash
    try {
      geohash = chat.tags.find(getTag('g'))![1]
    } catch(e) {
      // console.log('Couldn\'t find geohash tag')
    }
    return (
      <div key={index} className="chat">
        <p className="chat-text">{chat.content}</p>
        <p className="chat-author">{chat.pubkey}</p>
        { geohash && <p className="chat-geohash">{geohash}</p> }
      </div>
    )
  })

  return (
    <div className={`component-geochat ${show ? 'show' : 'hide'}`}>
      {chatList}
    </div>
  )
}