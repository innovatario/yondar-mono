import { useState, useEffect, useContext } from 'react'
import { Marker } from 'react-map-gl'
import '../scss/Cursor.scss'
import { useGeolocationData } from '../hooks/useGeolocationData'
import { ModeContext, ModeContextType } from '../providers/ModeProvider'

type CursorProps = {
  children?: React.ReactNode
}

export const Cursor = ({children}: CursorProps) => {

  const {mode, setMode} = useContext<ModeContextType>(ModeContext)
  const [,setPinDrop] = useState(false) // this is used to trigger the pin drop animation
  const {cursorPosition, setCursorPosition} = useGeolocationData()

  const size = 30

  useEffect(() => {
    setPinDrop(false)
  }, [cursorPosition])

  const hideCursor = () => {
    setCursorPosition(null)
    if (mode === 'add') setMode(null)
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

