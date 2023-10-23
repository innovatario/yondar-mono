import React from 'react'
import { FaRocket as Icon } from 'react-icons/fa'
import '../scss/ZoomOutButton.scss'
import { useMap } from 'react-map-gl'

interface ZoomOutButtonProps {
  show: boolean,
}

/* TODO: add notification number in red to show how many chats are available in this area */
export const ZoomOutButton: React.FC<ZoomOutButtonProps> = ({ show }: {show: boolean}) => {
  const {current: map} = useMap()

  const zoomOut = () => {
    map && console.log('zoom out')
    map && map.flyTo({
      zoom: 2,
      duration: 2000,
    })
  }
  return (
    <button
      className={`component-zoomoutbutton ${show ? 'show' : 'hide'}`}
      onClick={zoomOut}
    >
      <Icon size={24} />
    </button>
  )
}
