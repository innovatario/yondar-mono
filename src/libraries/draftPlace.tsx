import { nip19 } from "nostr-tools"
import { DraftPlace, GooglePlaceStatus, GooglePlaceType, Place } from "../types/Place"
import { defaultRelays } from "./Nostr"

/**
 * 
 * @returns a DraftPlace object based on the form data
 */
export const createDraftPlace = (
  name: string,
  geohash: string,
  naddr: string,
  coords: [number, number],
  abbrev: string,
  description: string,
  streetAddress: string,
  locality: string,
  region: string,
  countryName: string,
  postalCode: string,
  type: GooglePlaceType,
  status: GooglePlaceStatus,
  website: string,
  phone: string
) => {
  const newPlace: DraftPlace = {
    kind: 37515,
    tags: [
      ["d", name],
      ["g", geohash],
      [
        "alt",
        `This event represents a place. View it on https://go.yondar.me/place/${naddr}`,
      ],
    ],
    content: {
      type: "Feature",
      geometry: {
        coordinates: [coords[0], coords[1]],
        type: "Point",
      },
      properties: {
        name,
        abbrev,
        description,
        address: {
          "street-address": streetAddress,
          locality,
          region,
          "country-name": countryName,
          "postal-code": postalCode,
        },
        type,
        status,
        website,
        phone,
      },
    },
  }
  return newPlace
}


// write a properly typed getTag function to pass into the find method that takes a tag string and returns the value for that key
type FindTag = (tag: string[], i: number, o: string[][]) => boolean 

const getTag = (key: string): FindTag => {
  return (tag): boolean => {
    return tag && Array.isArray(tag) && tag[0] === key
  }
}

export const beaconToDraftPlace = (beacon: Place) => {
  // attempt to gather the properiets we aren't sure of
  const gtag = beacon.tags.find(getTag("g"))
  const geohash = gtag ? gtag[1] : ""
  const alttag = beacon.tags.find(getTag("alt"))
  const previousAlt = alttag ? alttag[1] : null
  let alt
  if (!previousAlt) {
    // no previous alt tag with naddr, create a new one
    const naddr = createNaddr(beacon.pubkey, beacon.content.properties.name)
    alt = `This event represents a place. View it on https://go.yondar.me/place/${naddr}`
  } else {
    // use the previous alt tag
    alt = previousAlt
  }
  return createDraftPlace(
    beacon.content.properties.name,
    geohash,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    alt,
    beacon.content?.geometry?.coordinates,
    beacon.content?.properties?.abbrev,
    beacon.content?.properties?.description,
    beacon.content?.properties?.address?.["street-address"],
    beacon.content?.properties?.address?.locality,
    beacon.content?.properties?.address?.region,
    beacon.content?.properties?.address?.["country-name"],
    beacon.content?.properties?.address?.["postal-code"],
    beacon.content?.properties?.type,
    beacon.content?.properties?.status,
    beacon.content?.properties?.website,
    beacon.content?.properties?.phone
  )
}

export const createNaddr = (pubkey: string, name: string) => {
  const naddr = nip19.naddrEncode({
    pubkey: pubkey,
    // TODO: replace with relay provider
    relays: defaultRelays,
    kind: 37515,
    identifier: name,
  })
  return naddr
}