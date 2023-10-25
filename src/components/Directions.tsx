import { useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { Layer, LngLatBoundsLike, Source, useMap } from 'react-map-gl'
import { useNavigationTarget } from '../hooks/useNavigationTarget'
import { useGeolocationData } from '../hooks/useGeolocationData'
import { Geometry } from 'geojson'

type DirectionsResponse = {
  geometry: Geometry
  distance: number
  duration: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  legs: any[]
}

export const Directions = () => {
  const [turns, setTurns] = useState<DirectionsResponse>()
  const {target} = useNavigationTarget()
  const {position} = useGeolocationData()
  const {current: map} = useMap()

  useEffect(() => {
    console.log(position, target)
    if (!position) return // TODO - show warning
    if (!target) return
    if (!map) return
    // make call to mapbox directions api
    // https://docs.mapbox.com/api/navigation/directions/#optional-parameters
    fetch(`https://api.mapbox.com/directions/v5/mapbox/walking/${position.coords.longitude},${position.coords.latitude};${target[0]},${target[1]}?access_token=${import.meta.env.VITE_MAPBOX_API}&geometries=geojson&overview=full`)
    .then((response) => response.json())
    .then((data) => {
      if (data.routes.length > 0) {
        console.log(data, data.routes, data.routes[0])
        setTurns(data.routes[0])
        // TODO - zoom out map so we can see the whole route
        const bounds = data.routes[0].geometry.coordinates.reduce( (bounds: mapboxgl.LngLatBounds, coord: number[]) => bounds.extend(coord as LngLatBoundsLike), new mapboxgl.LngLatBounds())
        map.fitBounds(bounds, { padding: 50 })
      }
    })

    // We don't want to include position in the deps because we don't want to be calling this API every second.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target,map])

  if (!turns) return null
  return (
    <Source id="directions" type="geojson" data={turns?.geometry}>
      <Layer
        id="directions-line"
        type="line"
        source="directions"
        layout={{
          'line-cap': 'round',
          'line-join': 'round'
        }}
        paint={{
          'line-color': '#ff6c9a',
          'line-opacity': 0.8,
          'line-width': 10,
        }} />
    </Source>
  )
}