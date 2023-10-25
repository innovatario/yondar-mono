import { useEffect, useState } from 'react'
import { Layer, Source } from 'react-map-gl'
import { useNavigationTarget } from '../hooks/useNavigationTarget'
import { useGeolocationData } from '../hooks/useGeolocationData'

export const Directions = () => {
  const [turns, setTurns] = useState()
  const {target} = useNavigationTarget()
  const {position} = useGeolocationData()

  useEffect(() => {
    console.log(position, target)
    if (!position) return // TODO - show warning
    if (!target) return
    // make call to mapbox directions api
    fetch(`https://api.mapbox.com/directions/v5/mapbox/walking/${position.coords.longitude},${position.coords.latitude};${target[0]},${target[1]}?access_token=${import.meta.env.VITE_MAPBOX_API}&geometries=geojson`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data, data.routes, data.routes[0])
      setTurns(data.routes[0])
    })

    // We don't want to include position in the deps because we don't want to be calling this API every second.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  if (!turns) return null
  return (
    <Source id="directions" type="geojson" data={turns.geometry}>
      <Layer
        id="directions-line"
        type="line"
        source="directions"
        paint={{
          'line-color': '#ffffff',
          'line-opacity': 0.8,
          'line-width': 2,
        }} />
    </Source>
  )
}