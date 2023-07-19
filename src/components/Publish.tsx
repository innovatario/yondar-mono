import { useContext, useEffect, useState, useRef } from "react"
import { useNavigate } from 'react-router-dom'
import { IdentityContext } from "../providers/IdentityProvider"
import { defaultRelays, pool } from "../libraries/Nostr"
import { IdentityContextType } from "../types/IdentityType"
import {
  getEventHash,
  Filter,
  Event
} from 'nostr-tools'
import { signEvent } from "../libraries/NIP-07"

export const Publish = () => {
  const [loading, setLoading] = useState(false)
  const {identity} = useContext<IdentityContextType>(IdentityContext)
  const [events, setEvent] = useState<Array<Event>>([])
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect( () => {
    const filter: Filter = {kinds: [37515]}
    const sub = pool.sub(defaultRelays, [filter])
    sub.on('event', (e) => {
      console.log('found 37515:',e)
      setEvent([...events, e])
    })
  }, [])

  const publish = async () => {
    const json = textAreaRef.current?.value
    if (!json) return
    const event = JSON.parse(json)
    event.created_at = Math.floor(Date.now() / 1000)
    event.pubkey = identity?.pubkey
    event.id = getEventHash(event)
    const signedEvent = await signEvent(event)
    console.log(signedEvent)
    if (!signedEvent) return
    const pub = pool.publish( defaultRelays, signedEvent)
    pub.on('ok', () => {
      console.log('Event published successfully!')
    })
    pub.on('failed', (reason: string) => {
      console.error(`Failed to publish event. ${reason}`)
    })
  }
  // return a simple form where we can paste in our Place JSON and press publish
  // to sign it and publish it to the connected relays
  const displayEvents = () => {
    if (events.length===0) return null
    return events.map( (e) => {
      const content = JSON.parse(e.content)
      return (
        <div>
          <h2>Event received:</h2>
          <p>{e.id}</p>
          <p>{e.created_at}</p>
          <p>{e.sig}</p>
          <p>{content.properties.name}</p>
          <p>{content.properties.address?.locality}</p>
          <p>{content.properties.description}</p>
        </div>
      )
    })
  }

  return (
    <div id="publish">
      <h1>Publish a Place</h1>
      <p>Input JSON:</p>
      <textarea ref={textAreaRef}></textarea>
      <button onClick={publish}>Publish</button>
      <hr/>
      { displayEvents() }
    </div>
  )
}