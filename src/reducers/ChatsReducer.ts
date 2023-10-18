import { Event } from "nostr-tools";

export type Chat = Event

export type ChatsState = Chat[]

export type ChatsAction = {
    type: 'add' | 'remove' | 'clearall'
    payload?: Chat
}

export const initialState: ChatsState = []

export const chatsReducer = (state: ChatsState = initialState, action: ChatsAction): ChatsState => {

  // sort chats by most recent to least recent
  const sortChats = (chats: Chat[]) => {
    return chats.sort((a, b) => {
      return b.created_at - a.created_at;
    })
  }
  
  //deduplicate chats by id
  const dedupeChats = (chats: Chat[]) => {
    return chats.filter((chat, index, self) =>
      index === self.findIndex((t) => (
        t.id === chat.id
      ))
    )
  }

  switch (action.type) {
    case 'add':
      return dedupeChats(sortChats([...state, action.payload!]));
    case 'remove':
      return dedupeChats(sortChats(state.filter(chat => chat.id !== action.payload!.id)));
    case 'clearall':
      return [];
    default:
      return dedupeChats(sortChats(state));
  }
}