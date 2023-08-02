import React, { Dispatch, SetStateAction, useEffect }  from 'react'
import { useGeolocation, validGeolocation } from '../hooks/useGeolocation'
import { useGeolocationData } from '../hooks/useGeolocationData'
import { Marker, useMap } from 'react-map-gl'
import { FollowTarget } from '../types/Follow'
import '../scss/Me.scss'

type MeProps = {
  setFollow: Dispatch<SetStateAction<FollowTarget>>
}

export const Me: React.FC<MeProps> = ({ setFollow }) => {

  const { position } = useGeolocation()
  const { setPosition } = useGeolocationData()

  const {current: map} = useMap()

  const emoji = "😀"
  const userStyle = {
    backgroundColor: '#00AEEF'
  }

  const handleFollow = () => {
    if (map && position) {
      map.flyTo({
        center: [position?.coords.longitude, position?.coords.latitude],
        zoom: 16,
        duration: 1000,
      })
      map.once('moveend', () => setFollow("USER"))
    }
  }

  // this will fire on each navigator watch position update
  useEffect(() => {
    if (validGeolocation(position)) {
      setPosition(position)
    }
  }, [position, setPosition])

  if (validGeolocation(position)) {
    return (
      <Marker longitude={position?.coords.longitude} latitude={position?.coords.latitude} anchor={'center'} offset={[-15.5,-15.5]}>
        <div id="me" className="component-useremoji" onClick={handleFollow}>
          <div className='color-ring' style={userStyle}>
            <span role='img'>{emoji}</span>
          </div>
        </div>
      </Marker>
    )
  } else {
    return null
  }
}