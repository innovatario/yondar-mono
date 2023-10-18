import React from 'react'
import { FaMapPin } from 'react-icons/fa'
import '../scss/AddButton.scss'

interface AddButtonProps {
  onClick: () => void,
  show: boolean,
}

/* TODO: add notification number in red to show how many chats are available in this area */
export const AddButton: React.FC<AddButtonProps> = ({ onClick, show }: {onClick: () => void, show: boolean}) => {
  return (
    <button
      className={`component-addbutton ${show ? 'show' : 'hide'}`}
      onClick={onClick}
    >
      <FaMapPin size={30}/>
    </button>
  )
}
