import React, { useState, useEffect } from 'react'
import { Marker, useMap } from 'react-map-gl'
import '../scss/Cursor.scss'
import { WavyText } from './WavyText'

type CursorProps = {
  lnglat: {
    lng: number, 
    lat: number
  }
}

export const Cursor: React.FC<CursorProps> = ({ lnglat }) => {

  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false)

  const {current: map} = useMap()

  const size = 30

  useEffect(() => {
    setShowAddPlaceModal(false)
  }, [lnglat])

  const handleClickCursor = () => {
    if (map && lnglat) {
      map.flyTo({
        center: [lnglat.lng, lnglat.lat],
        duration: 500,
      })
      map.once('moveend', () => setShowAddPlaceModal(true))
    }
  }

  // this will fire on each navigator watch position update
  if (lnglat) {
    return (
      <Marker longitude={lnglat.lng} latitude={lnglat.lat} anchor={'center'} offset={[0,0]}>
        <div id="cursor" className="component-cursor" onClick={handleClickCursor}>
          <AddPlace drop={showAddPlaceModal}/>
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

const AddPlace = ({drop}) => {
  const floatStyle = {

  }
  const classes = "cursor-menu " + (drop ? "no-shadow" : "")
  return (
    <div className={classes}>
      { drop ? null : <div className="add-a-place"><WavyText text="Add a Place"/></div> }
      { drop ? <div className="dropped-pin">📍</div> : <WavyText text='📍'/> }
    </div>
  )
}