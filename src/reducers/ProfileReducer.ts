import { Event } from 'nostr-tools'
import { IdentityType } from '../types/IdentityType'

export type Profile = Event & { content: IdentityType }

export type ProfileState = Profile[]

export type ProfileAction = {
    type: 'add' | 'clearall'
    payload?: Profile
}

export const initialState: ProfileState = []

export const profileReducer = (state: ProfileState = initialState, action: ProfileAction): ProfileState => {

  
  //deduplicate profiles by id
  const dedupeProfiles = (profiles: Profile[]) => {
    return profiles.filter((profile, index, self) =>
      index === self.findIndex((t) => (
        t.id === profile.id
      ))
    )
  }

  switch (action.type) {
    case 'add':
      return dedupeProfiles([...state, action.payload!])
    case 'clearall':
      return []
    default:
      return dedupeProfiles([...state])
  }}