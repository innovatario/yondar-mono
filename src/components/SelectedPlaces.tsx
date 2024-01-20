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
          let key = place.id
          if (place.properties && place.properties.name && place.properties.pubkey) key = place.properties.name + place.properties.pubkey + place.id
          return (
            <SelectedPlace place={place} key={key} />
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
      duration: 2000
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