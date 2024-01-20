import mapboxgl, { Point, PointLike } from 'mapbox-gl'
import '../scss/SelectedPlaces.scss'
import { useCallback } from 'react'
import { MapRef, useMap } from 'react-map-gl'
import { useGeolocationData } from '../hooks/useGeolocationData'

type SelectedPlacesType = {
  map: React.RefObject<MapRef>
  set: mapboxgl.MapboxGeoJSONFeature[]
}

export const SelectedPlaces = ({set}: SelectedPlacesType) => {
  return (
    <div id="selected-places">
        {set.map((place: mapboxgl.MapboxGeoJSONFeature) => {
          return (
            <SelectedPlace place={place} key={place.id} />
          )
        })}
    </div>
  )
}

const SelectedPlace = ({place}: {place: mapboxgl.MapboxGeoJSONFeature}) => {
  const {current: map} = useMap()
  const {setCursorPosition} = useGeolocationData()


  const zoomTo = useCallback(() => {
    console.log('place', place)
    if (!map) return
    if (!place.properties) return
    if (place.geometry.type !== 'Point') return
    // setCursorPosition({lng: place.properties.longitude, lat: place.properties.latitude})
    setCursorPosition(null)
    map.flyTo({
      center: [
        place.properties.longitude,
        place.properties.latitude],
      zoom: 16, 
      duration: 1000
    })
    // map.once('moveend', () => {
    //   setCursorPosition(map.getCenter())
    // })
  }, [map, place.properties])
  return (
    <div className="selected-place" onClick={zoomTo}>
      {place.properties?.name ? <h2 className="place-name">{place.properties.name}</h2> : null}
    </div>
  )
}