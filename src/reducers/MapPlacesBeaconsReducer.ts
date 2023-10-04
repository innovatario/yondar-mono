import { Place } from '../types/Place'
import { getUniqueBeaconID } from '../libraries/NIP-33'

type beaconsReducerType = {
  [key: string]: Place
}

export const beaconsReducer = (state: beaconsReducerType, action: { type: string; beacon?: Place, beaconUniqueID?: string, deletionPubkey?: string }) => {

  if (action.beacon) {
    const unique = getUniqueBeaconID(action?.beacon)
    const existing = state[unique]
    // only save the newest beacon by created_at timestamp; if this incoming beacon s older, don't save it.
    if (existing && existing.created_at > action.beacon.created_at) return state

    if (action.type === 'add') {
      return {
        ...state,
        [unique]: action.beacon  
      }
    }
  } else if (action.type === "remove") {
    // trying to remove because of kind 5 deletion
    if (action.beaconUniqueID && action.deletionPubkey && state[action.beaconUniqueID]?.pubkey === action.deletionPubkey) {
      const newState = {...state}
      delete newState[action.beaconUniqueID]
      return newState
    }
  }

  // proceed with clear or return state without action
  switch(action.type) {
    case 'clear':
      return {}
    default:
      return state
  }
}
