import React, { Dispatch, SetStateAction, useEffect }  from 'react'
import { useGeolocation, validGeolocation } from '../hooks/useGeolocation'
import { useGeolocationData } from '../providers/GeolocationProvider'
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

  useEffect(() => {
    if (validGeolocation(position)) {
      setPosition(position)
    }
  }, [position, setPosition])

  if (validGeolocation(position)) {
    return (
      <Marker longitude={position?.coords.longitude} latitude={position?.coords.latitude} anchor={'center'}>
        <div id="me" onClick={() => setFollow("USER")}>😀</div>
      </Marker>
    )
  } else {
    return null
  }
}