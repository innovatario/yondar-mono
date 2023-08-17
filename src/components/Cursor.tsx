import React, { useContext, useState, useEffect } from 'react'
import { Marker, useMap } from 'react-map-gl'
import '../scss/Cursor.scss'
import { WavyText } from './WavyText'
import { ModalContextType } from "../types/ModalType"
import { ModalContext } from "../providers/ModalProvider"
import { useGeolocationData } from '../hooks/useGeolocationData'


export const Cursor: React.FC = () => {

  const [pinDrop, setPinDrop] = useState(false) // this is used to trigger the pin drop animation
  const {modal} = useContext<ModalContextType>(ModalContext)
  const {cursorPosition} = useGeolocationData()


  const {current: map} = useMap()

  const size = 30

  useEffect(() => {
    setPinDrop(false)
  }, [cursorPosition])

  const center = (duration = 0) => {
    map.flyTo({
      center: [cursorPosition.lng, cursorPosition.lat],
      duration
    })
  }
  const moveCallbackOnce = (callback) => {
    map.once('moveend', callback)
  }

  const handleClickCursor = () => {
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

  // this will fire on each navigator watch position update
  if (cursorPosition) {
    return (
      <Marker longitude={cursorPosition.lng} latitude={cursorPosition.lat} anchor={'center'} offset={[0,0]}>
        <div id="cursor" className="component-cursor" onClick={handleClickCursor}>
          <AddPlace drop={pinDrop}/>
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
  const classes = "cursor-menu " + (drop ? "no-shadow" : "")
  return (
    <div className={classes}>
      { drop ? null : <div className="add-a-place"><WavyText text="Add a Place"/></div> }
      { drop ? <div className="dropped-pin">📍</div> : <WavyText text='📍'/> }
    </div>
  )
}