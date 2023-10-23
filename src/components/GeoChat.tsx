import { useRef, useState, useEffect, useContext, useReducer } from 'react'
import '../scss/GeoChat.scss'
import { useGeolocationData } from '../hooks/useGeolocationData'
import Geohash from 'latlon-geohash'
import { getRelayList, getTag, pool } from '../libraries/Nostr'
import { RelayList } from '../types/NostrRelay'
import { Event, Filter, UnsignedEvent, getEventHash, getSignature } from 'nostr-tools'
import { IdentityContextType } from '../types/IdentityType'
import { IdentityContext } from '../providers/IdentityProvider'
import { chatsReducer } from '../reducers/ChatsReducer'
import { IoMdSend as Icon } from 'react-icons/io'
import { decryptPrivateKey } from '../libraries/EncryptAndStoreLocal'
import { signEvent } from '../libraries/NIP-07'

const ONE_WEEK = 60 * 60 * 24 * 7

export const GeoChat = ({show, mapLngLat, zoom}: {show: boolean, mapLngLat: number[], zoom: number}) => {
  const {position, cursorPosition} = useGeolocationData()
  const { identity, relays } = useContext<IdentityContextType>(IdentityContext)
  const [chats, chatsDispatch] = useReducer(chatsReducer, [])
  const [hash, setHash] = useState<string>('') // the currently selected geochat
  const [myHash, setMyHash] = useState<string>('') // the geochat of the user's position
  const composeRef = useRef<HTMLTextAreaElement>(null)

  // update the user's geohash when they move
  useEffect(() => {
    const lnglat = position?.coords.longitude && position?.coords.latitude ? [position.coords.longitude, position.coords.latitude] : null 
    if (!lnglat) return
    const zoomFactor = Math.ceil((zoom * 0.8)/5*3)
    const hashLength = Math.max(1, Math.min(5, zoomFactor))
    const newHash = Geohash.encode(lnglat[1], lnglat[0], hashLength)
    if (newHash !== myHash) {
      setMyHash(newHash)
      console.log('my hash',newHash)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, zoom])

  // update the currently selected geochat hash when the cursor or map position changes
  useEffect(() => {
    const lnglat = cursorPosition ? [cursorPosition.lng, cursorPosition.lat] : mapLngLat 
    const zoomFactor = Math.ceil((zoom * 0.8)/5*3)
    const hashLength = Math.max(1, Math.min(5, zoomFactor))
    const newHash = Geohash.encode(lnglat[1], lnglat[0], hashLength)
    if (newHash !== hash) {
      setHash(newHash)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorPosition, mapLngLat, zoom])

  useEffect(() => {
    if (!hash) return
    chatsDispatch({type: 'clearall'})
    // get kind1 notes tagged with the current geohash
    const filter: Filter = { kinds: [1], "#g": [hash]}
    console.log('searching for messages:', filter, hash)
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

  const sendNote = async () => {
    const content = composeRef.current?.value
    console.log('1', composeRef.current)
    if (!content) return
    console.log('2')
    const created_at = Math.floor(Date.now() / 1000)
    const event: UnsignedEvent = {
      kind: 1,
      tags: [
        ['g', hash],
        ['expiration', (created_at + ONE_WEEK).toString() ]
      ],
      content,
      created_at,
      pubkey: identity.pubkey,
    }

    let signedEvent

    if (localStorage.getItem("storens")){
      // sign via nostr-tools
      let sk
      const tryToSign = async () => {
        try {
          sk = await decryptPrivateKey('signing') 
        } catch (e) {
          alert("Wrong password! Could not decrypt local signing key. Please try publishing again.")
        }
      }
      await tryToSign()
      if (!sk) signedEvent = null
      else {
        const eventHash = await getEventHash(event)
        const eventSig = await getSignature(event, sk)
        signedEvent = event as Event
        signedEvent.id = eventHash
        signedEvent.sig = eventSig
      }
    } else {
      signedEvent = await signEvent(event)
    }

    if (signedEvent === null) {
      // TODO: notify user
      console.error("Failed to sign event.")
      return
    }

    const relayList = getRelayList(relays, ['write'])
    const pub = pool.publish(relayList, signedEvent)
    pub.on("ok", () => {
      console.log("Event published successfully!")
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      composeRef.current!.value = ''
    })
    pub.on("failed", (reason: string) => {
      console.error(`Failed to publish event. ${reason}`)
    })

  }

  const chatList = chats.map((chat, index) => {
    let geohash
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

  chatList.unshift(<h2 key={hash} className="title">Geochat #{hash}</h2>)

  const showCompose = hash === myHash

  return (
    <div className={`component-geochat ${show ? 'show' : 'hide'}`}>
      <div className={"chat-container" + (showCompose ? '' : ' no-compose')}>
        {chatList}
      </div>
      { showCompose ? 
        <div className="chat-compose">
          <textarea ref={composeRef} id="compose" className="chat-textarea" placeholder="Write a message..."></textarea>
          <button id="send" className="chat-send" onClick={sendNote}><Icon size={20}/></button>
        </div>
      : null }
    </div>
  )
}