import { DraftPlace, Place } from "../types/Place"
import { getTag } from "./Nostr"

export const getUniqueBeaconID = (beacon: Place) => {
  const dtag = beacon.tags.find(getTag("d"))
  const dtagValue = dtag?.[1]
  const pubkey = beacon.pubkey
  const kind = beacon.kind
  return `${kind}:${pubkey}:${dtagValue}`
}

export const getUniqueDraftBeaconID = (beacon: DraftPlace, pubkey: string) => {
  const dtag = beacon.tags.find(getTag("d"))
  const dtagValue = dtag?.[1]
  const kind = beacon.kind
  return `${kind}:${pubkey}:${dtagValue}`
}
