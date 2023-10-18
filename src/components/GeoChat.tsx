import { useState, useEffect, useContext, useReducer } from 'react'
import '../scss/GeoChat.scss'
import { useGeolocationData } from '../hooks/useGeolocationData'
import Geohash from 'latlon-geohash'
import { getRelayList, getTag, pool } from '../libraries/Nostr'
import { RelayList } from '../types/NostrRelay'
import { Filter } from 'nostr-tools'
import { IdentityContextType } from '../types/IdentityType'
import { IdentityContext } from '../providers/IdentityProvider'
import { chatsReducer } from '../reducers/ChatsReducer'

export const GeoChat = ({show, mapLngLat, zoom}: {show: boolean, mapLngLat: number[], zoom: number}) => {
  const {cursorPosition} = useGeolocationData()
  const { relays } = useContext<IdentityContextType>(IdentityContext)
  const [chats, chatsDispatch] = useReducer(chatsReducer, [])
  const [hash, setHash] = useState<string>('')

  useEffect(() => {
    const lnglat = cursorPosition ? [cursorPosition.lng, cursorPosition.lat] : mapLngLat 
    const zoomFactor = Math.ceil((zoom * 0.8)/5*3)
    const hashLength = Math.max(1, Math.min(5, zoomFactor))
    const newHash = Geohash.encode(lnglat[1], lnglat[0], hashLength)
    if (newHash !== hash) {
      setHash(newHash)
    }
  }, [cursorPosition, mapLngLat, zoom])

  useEffect(() => {
    if (!hash) return
    chatsDispatch({type: 'clearall'})
    // get kind1 notes tagged with the current geohash
    const filter: Filter = { kinds: [1], "#g": [hash]}
    console.log('hash',hash)
    const relayList: RelayList = getRelayList(relays, ['read'])
    const sub = pool.sub(relayList, [filter])
    sub.on('event', (event) => {
      chatsDispatch({type: 'add', payload: event})
      // console.log('added', event)
    })
    return () => {
      chatsDispatch({type: 'clearall'})
      sub.unsub()
    }
  }, [hash, relays])

  const chatList = chats.map((chat, index) => {
    let geohash
    try {
      geohash = chat.tags.find(getTag('g'))![1]
    } catch(e) {
      // console.log('Couldn\'t find geohash tag')
    }
    return (
      <div key={index+chat.id} className="chat">
        <p className="chat-date">{new Date(chat.created_at * 1000).toDateString()}</p>
        <p className="chat-text">{chat.content}</p>
        <p className="chat-author">author: {chat.pubkey.substring(0,6)}</p>
        { geohash && <p className="chat-geohash">geo#{geohash}</p> }
      </div>
    )
  })

  chatList.unshift(<h2 key={hash} className="title">GeoChat: #{hash}</h2>)

  return (
    <div className={`component-geochat ${show ? 'show' : 'hide'}`}>
      {chatList}
    </div>
  )
}