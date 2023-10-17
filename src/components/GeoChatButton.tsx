import React from 'react'
import { FaComments } from 'react-icons/fa'

interface ChatButtonProps {
  onClick: () => void
}

export const GeoChatButton: React.FC<ChatButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#007bff',
        color: '#ffffff',
        border: '2px solid #007bcc',
        outline: 'none',
        cursor: 'pointer',
        padding: '7px',
        boxShadow: '5px 5px 5px 0px rgba(0,0,0,0.5)',
        position: 'absolute',
        right: '0.25rem',
        bottom: '2rem',
      }}
    >
      <FaComments size={44} />
    </button>
  )
}
