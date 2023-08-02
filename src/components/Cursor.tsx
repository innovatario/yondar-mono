import React, { useState } from 'react'
import { Marker, useMap } from 'react-map-gl'
import '../scss/Cursor.scss'

type CursorProps = {
  lnglat: {
    lng: number, 
    lat: number
  }
}

export const Cursor: React.FC<CursorProps> = ({ lnglat }) => {

  const [showCursorMenu, setShowCursorMenu] = useState(false)

  const {current: map} = useMap()

  const size = 30

  const handleFollow = () => {
    if (map && lnglat) {
      map.flyTo({
        center: [lnglat.lng, lnglat.lat],
        duration: 500,
      })
      map.once('moveend', () => setShowCursorMenu(true))
    }
  }

  // this will fire on each navigator watch position update
  if (lnglat) {
    return (
      <Marker longitude={lnglat.lng} latitude={lnglat.lat} anchor={'center'} offset={[0,0]}>
        <div id="cursor" className="component-cursor" onClick={handleFollow}>
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