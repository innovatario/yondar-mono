import mapboxgl from 'mapbox-gl'
import '../scss/SelectedPlaces.scss'

type SelectedPlacesType = {
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
  return (
    <div className="selected-place">
      {place.properties?.name ? <h2 className="place-name">{place.properties.name}</h2> : null}
    </div>
  )
}