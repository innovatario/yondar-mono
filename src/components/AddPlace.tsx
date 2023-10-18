import { useContext, useEffect, useState } from 'react'
import { WavyText } from './WavyText'
import { ModalContextType } from '../types/ModalType'
import { ModalContext } from '../providers/ModalProvider'
import { useMap } from 'react-map-gl'
import { useGeolocationData } from '../hooks/useGeolocationData'

export const AddPlace = () => {
  const {modal} = useContext<ModalContextType>(ModalContext)
  const {current: map} = useMap()
  const {cursorPosition} = useGeolocationData()
  const [drop, setDrop] = useState<boolean>(false)

  useEffect(() => {
    setDrop(false)
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

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    if (modal?.placeForm === false) {
      center(500)
      moveCallbackOnce( () => {
        setDrop(true)
        setTimeout(() => modal?.setPlaceForm(true), 500)
      })
    }
  }

  const classes = "cursor-menu " + (drop ? "no-shadow" : "")

  return (
    <div className={classes} onClick={handleClick}>
      {drop ? null : <div className="add-a-place"><WavyText text="Add a Place" /></div>}
      {drop ? <div className="dropped-pin">📍</div> : <WavyText text='📍' />}
    </div>
  )
}
