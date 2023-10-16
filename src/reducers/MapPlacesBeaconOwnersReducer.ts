import { IdentityType } from '../types/IdentityType'
import { Event } from 'nostr-tools'

export type Owner = Event & { content: IdentityType }
type beaconOwnersReducerType = {
  [key: string]: Owner
} 

export const beaconOwnersReducer = (state: beaconOwnersReducerType, action: { type: string; owner?: Owner}) => {
  if (action.owner && action.owner.pubkey) {
    const unique = action.owner.pubkey
    if (action.type === 'add') {
      return {
        ...state,
        [unique]: action.owner
      }
    }
  }

  // proceed with save
  switch(action.type) {
    case 'clear':
      return {}
    default:
      return state
  }
}
