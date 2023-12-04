import { nip19 } from "nostr-tools"
import { DraftPlace, FeatureProperties, GooglePlaceStatus, GooglePlaceType, OldPlace, Place } from "../types/Place"
import { RelayList } from "../types/NostrRelay"
import { getTag } from "./Nostr"

/**
 * 
 * @returns a DraftPlace object based on the form data
 */
export const createDraftPlace = (featureProperties: FeatureProperties, dtag, geohash, naddr, coords) => {
  const newPlace: DraftPlace = {
    kind: 37515,
    tags: [
      ["d", dtag],
      ["g", geohash],
      [
        "alt",
        `This event represents a place. View it on https://go.yondar.me/place/${naddr}`,
      ],
    ],
    content: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            coordinates: [coords[0], coords[1]],
            type: "Point",
          },
          properties: {
            ...featureProperties
          },
        }
      ]
    }
  }
  return newPlace
}


export const beaconToDraftPlace = (beacon: Place, relayList: RelayList) => {
  // attempt to gather the properiets we aren't sure of
  const dtag = beacon.tags.find(getTag("d"))
  const unique = dtag ? dtag[1] : null
  const gtag = beacon.tags.find(getTag("g"))
  const geohash = gtag ? gtag[1] : ""
  const alttag = beacon.tags.find(getTag("alt"))
  const previousAlt = alttag ? alttag[1] : null
  let naddr
  let alt
  if (!previousAlt) {
    // no previous alt tag with naddr, create a new one
    naddr = createNaddr(beacon.pubkey, beacon.content.properties.name, relayList.sort( (a, b) => a.length - b.length).slice(0, 3))

    alt = `This event represents a place. View it on https://go.yondar.me/place/${naddr}`
  } else {
    // use the previous alt tag
    alt = previousAlt
  }
  // determine if the content is formatted in the previous "OldPlace" format or the new format
  if (beacon.content.type === "FeatureCollection") {
    // new format
  } else {
    // old format
    // convert to new format
    const oldbeacon = beacon as unknown as OldPlace
    return createDraftPlace(
      {
        schema: {
          name: oldbeacon.content.properties.name,
          description: oldbeacon.content?.properties?.description,
          alternateName: oldbeacon.content?.properties?.abbrev,
        },
        osm: {
          "google:type": oldbeacon.content?.properties?.type as GooglePlaceType,
          "google:status": oldbeacon.content?.properties?.status as GooglePlaceStatus,
          "google:hours": oldbeacon.content?.properties?.hours,
          "website": oldbeacon.content?.properties?.website,
          "phone": oldbeacon.content?.properties?.phone,
          "addr:street": oldbeacon.content?.properties?.address?.["street-address"],
          "addr:city": oldbeacon.content?.properties?.address?.locality,
          "addr:state": oldbeacon.content?.properties?.address?.region,
          "addr:country": oldbeacon.content?.properties?.address?.["country-name"],
          "addr:postcode": oldbeacon.content?.properties?.address?.["postal-code"],
        }
      },
      unique,
      geohash,
      naddr,
      beacon.content.geometry.coordinates
    )
  }
  return createDraftPlace(
    beacon.content.properties.name,
    geohash,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    alt,
    beacon.content?.properties?.description,
    beacon.content?.properties?.type,
    beacon.content?.geometry?.coordinates,
    unique || beacon.content.properties.name,
    beacon.content?.properties?.abbrev,
    beacon.content?.properties?.address?.["street-address"],
    beacon.content?.properties?.address?.locality,
    beacon.content?.properties?.address?.region,
    beacon.content?.properties?.address?.["country-name"],
    beacon.content?.properties?.address?.["postal-code"],
    beacon.content?.properties?.status,
    beacon.content?.properties?.hours,
    beacon.content?.properties?.website,
    beacon.content?.properties?.phone
  )
}

export const createNaddr = (pubkey: string, name: string, relays: RelayList) => {
  const naddr = nip19.naddrEncode({
    pubkey: pubkey,
    // TODO: replace with relay provider
    relays,
    kind: 37515,
    identifier: name,
  })
  return naddr
}