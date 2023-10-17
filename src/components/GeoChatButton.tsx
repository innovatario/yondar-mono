import React from 'react'
import { FaComments } from 'react-icons/fa'

interface ChatButtonProps {
  onClick: () => void,
  show: boolean,
}

/* TODO: add notification number in red to show how many chats are available in this area */
export const GeoChatButton: React.FC<ChatButtonProps> = ({ onClick, show }: {onClick: () => void, show: boolean}) => {
  return (
    <button
      className={`component-geochatbutton ${show ? 'show' : 'hide'}`}
      onClick={onClick}
    >
      <FaComments size={44} />
    </button>
  )
}
