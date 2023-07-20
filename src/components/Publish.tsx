import { useContext, useEffect, useState, useRef } from "react"
import { IdentityContext } from "../providers/IdentityProvider"
import { defaultRelays, pool } from "../libraries/Nostr"
import { IdentityContextType } from "../types/IdentityType"
import {
  getEventHash,
  Filter,
  Event,
  nip19,
} from 'nostr-tools'
import { signEvent } from "../libraries/NIP-07"
import { BeaconCollection } from "../types/Beacon"
import '../scss/Publish.scss'

export const Publish = () => {
  const {identity} = useContext<IdentityContextType>(IdentityContext)
  const [beacons, setBeacons] = useState<BeaconCollection>({})
  const [copied, setCopied] = useState<boolean>()
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect( () => {
    const filter: Filter = {kinds: [37515]}
    const sub = pool.sub(defaultRelays, [filter])
    sub.on('event', (event) => {
      const updatedBeacons = {...beacons, [event.id]: event}
      setBeacons(updatedBeacons)
    })
  }, [])

  const publish = async () => {
    const json = textAreaRef.current?.value
    if (!json) return
    const event = JSON.parse(json)
    event.created_at = Math.floor(Date.now() / 1000)
    event.pubkey = identity?.pubkey
    if (typeof event.content !== 'string') {
      event.content = JSON.stringify(event.content)
        .replace(/"/g, '\"')
        .replace(/(?![^"])\s+/g, '')
      console.log('stringified content:', event.content)
    }
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
    if (Object.keys(beacons).length===0) return null
    return Object.values(beacons).map( (event) => {
      try {
        const content = JSON.parse(event.content)
        return (
          <div className="event">
            <p>
              {event.id}<br/>
              {event.created_at}<br/>
              {event.sig}<br/>
              {content.properties.name}<br/>
              {content.properties.address?.locality}<br/>
              {content.properties.description}
            </p>
          </div>
        )
      } catch (err) {
        console.error('failed to parse content:', event.id, event.created_at, err)
        return null
      }
    })
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(examplePlace)
      setCopied(true)
      setTimeout( () => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      setCopied(false)
    }
  }
  return (
    <div id="publish">
      <h1>Publish a Place</h1>
      <p>Accepts JSON formatted Place.</p>
      <p>Example below, click to copy. <strong>Note the <code>content</code> property may contain unserialized JSON; it will be serialized for you.</strong></p>
      <pre className={`copied-${copied}`} onClick={copy}>{examplePlace}</pre>
      <textarea placeholder="Event JSON here" ref={textAreaRef}></textarea>
      <button id="button-publish" type="button" onClick={publish}>Publish</button>
      <hr/>
      <h2>Place events found:</h2>
      { displayEvents() }
    </div>
  )
}

const exampleNaddr = nip19.naddrEncode({
  pubkey: "e8ed3798c6ffebffa08501ac39e271662bfd160f688f94c45d692d8767dd345a",
  relays: defaultRelays,
  kind: 37515,
  identifier: "North Dakota Heritage Center & State Museum"
})
const examplePlace = `
{
  "kind": 37515,
  "tags": [
    [ "d", "North Dakota Heritage Center & State Museum" ],
    [ "g", "cb266epj" ],
    [ "alt", "This event represents a place. View it on yondar.me/${exampleNaddr}" ]
  ],
  "content": {
    "type": "Feature",
    "properties": {
      "name": "North Dakota Heritage Center & State Museum",
      "abbrev": "Heritage Center",
      "description": "State history museum offering exhibits on the state's geologic prehistory, early peoples & culture.",
      "address": {
        "street-address": "612 E Boulevard Ave",
        "locality": "Bismarck",
        "region": "North Dakota",
        "country-name": "United States",
        "postal-code": "58505"
      },
      "type": "museum",
      "status": "OPERATIONAL",
      "website": "https://statemuseum.nd.gov/",
      "phone": "+1-701-328-2666",
      "hours": "Mo-Fr 08:00-17:00; Sa-Su 10:00-17:00"
    },
    "geometry": {
      "coordinates": [
        -100.77873491903246,
        46.81915362955226
      ],
      "type": "Point"
    }
  }
}`