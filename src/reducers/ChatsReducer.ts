import { Event } from "nostr-tools";

export type Chat = Event

export type ChatsState = Chat[]

export type ChatsAction = {
    type: 'add' | 'remove' | 'clearall'
    payload: Chat
}

export const initialState: ChatsState = []

export const chatsReducer = (state: ChatsState = initialState, action: ChatsAction): ChatsState => {

  // sort chats by most recent to least recent
  const sortChats = (chats: Chat[]) => {
    return chats.sort((a, b) => {
      return b.created_at - a.created_at;
    })
  }

  switch (action.type) {
    case 'add':
      return sortChats([...state, action.payload])
    case 'remove':
      return sortChats(state.filter(chat => chat.id !== action.payload.id))
    case 'clearall':
      return []
    default:
      return state
  }

}