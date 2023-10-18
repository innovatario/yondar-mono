import { useContext, useState, useEffect } from 'react'
import { Marker, useMap } from 'react-map-gl'
import '../scss/Cursor.scss'
import { ModalContextType } from "../types/ModalType"
import { ModalContext } from "../providers/ModalProvider"
import { useGeolocationData } from '../hooks/useGeolocationData'

type CursorProps = {
  children?: React.ReactNode
}

export const Cursor = ({children}: CursorProps) => {

  const [pinDrop, setPinDrop] = useState(false) // this is used to trigger the pin drop animation
  const {modal} = useContext<ModalContextType>(ModalContext)
  const {cursorPosition, setCursorPosition} = useGeolocationData()


  const {current: map} = useMap()

  const size = 30

  useEffect(() => {
    setPinDrop(false)
  }, [cursorPosition])

  const center = (duration = 0) => {
    map && cursorPosition && map.flyTo({
      center: [cursorPosition.lng, cursorPosition.lat],
      duration
    })
  }
  const moveCallbackOnce = (callback: () => void) => {
    map && map.once('moveend', callback)
  }

  const handleClickCursor = () => {
    if (edit) return

    if (map && cursorPosition) {

      if (pinDrop) {
        modal?.setPlaceForm(true)
      } else {
        // center, drop pin
        center(500)
        moveCallbackOnce( () => {
          setPinDrop(true)
          setTimeout(() => modal?.setPlaceForm(true), 500)
        })
      }
    }
  }

  const hideCursor = () => {
    setCursorPosition(null)
  }

  // this will fire on each navigator watch position update
  if (cursorPosition) {
    return (
      <Marker key={-1} longitude={cursorPosition.lng} latitude={cursorPosition.lat} anchor={'center'} offset={[0,0]}>
        <div id="cursor" className="component-cursor" onClick={hideCursor}>
          {children}
          <svg className="spinner" width={`${size}px`} height={`${size}px`} viewBox={`0 0 ${size+1} ${size+1}`} xmlns="http://www.w3.org/2000/svg">
            <circle className="path" fill="none" strokeWidth="4" strokeLinecap="round" cx={`${(size+1)/2}`} cy={`${(size+1)/2}`} r="15"></circle>
          </svg>
        </div>
      </Marker>
    )
  } else {
    return null
  }
}

