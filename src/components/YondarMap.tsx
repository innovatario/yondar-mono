import { useState, useContext } from 'react'
import { Me } from './Me'
import { MapPlaces } from './MapPlaces'
import { Cursor } from './Cursor'
import Map, { Layer, Source, ViewState } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useGeolocationData } from '../hooks/useGeolocationData'
import { FollowTarget } from '../types/Follow'
import { ModalContextType } from "../types/ModalType"
import { ModalContext } from "../providers/ModalProvider"
import { FeedToggle } from './FeedToggle'
import usePersistedState from '../hooks/usePersistedState'
import Geohash from 'latlon-geohash'

type YondarMapProps = {
  children?: React.ReactNode
}

export const YondarMap = ({ children }: YondarMapProps) => {
  const [longitude, setLongitude] = useState<number>(-80)
  const [latitude, setLatitude] = useState<number>(0)
  const {position, setCursorPosition} = useGeolocationData()
  const [zoom, setZoom] = useState<number>(1)
  const [follow, setFollow] = useState<FollowTarget>(null)
  const {modal} = useContext<ModalContextType>(ModalContext)
  const [globalFeed, setGlobalFeed] = usePersistedState<boolean>('feed', true)

  function setViewState(viewState: ViewState) {
    // unlock map, we moved the map by interaction
    setFollow(null)
    setLongitude(viewState.longitude)
    setLatitude(viewState.latitude)
    setZoom(viewState.zoom)
  }

  function handleClick(event: mapboxgl.MapLayerMouseEvent) {
    if ((event.originalEvent?.target as HTMLElement)?.tagName === "CANVAS") {
      // we touched the map. Place the cursor.
      if (modal?.placeForm === true) {
        // if the place form is open, don't move the cursor
        // close the place form
        modal.setPlaceForm(false)
      } else { 
        setCursorPosition(event.lngLat)
      }
    }
  }

  const toggleFeed = () => {
    setGlobalFeed(!globalFeed)
  }

  const mapLongitude = position && follow === "USER" ? position?.coords.longitude : longitude
  const mapLatitude = position && follow === "USER" ? position?.coords.latitude : latitude

  const geohash = () => {
    const hash = Geohash.encode(mapLatitude, mapLongitude, 5)
    const bounds = Geohash.bounds(hash)
    const boundsArray = [
      [bounds.sw.lon, bounds.sw.lat],
      [bounds.ne.lon, bounds.sw.lat],
      [bounds.ne.lon, bounds.ne.lat],
      [bounds.sw.lon, bounds.ne.lat],
      [bounds.sw.lon, bounds.sw.lat]
    ]
    const boundsGeoJSON = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [boundsArray]
      },
      properties: {
        name: hash
      }
    }

    return (
      <Source id="geohash" type="geojson" data={boundsGeoJSON}>
        <Layer
          id="geohash-fill"
          type="fill"
          source="geohash"
          paint={{
            'fill-color': '#7200ff',
            'fill-opacity': 0.1
          }}
        />
        <Layer
          id="geohash-line"
          type="line"
          source="geohash"
          paint={{
            'line-color': '#4707b1',
            'line-opacity': 0.8,
            'line-width': 2,
          }}
        />
        <Layer
          id="geohash-text"
          type="symbol"
          source="geohash"
          layout={{
            'text-field': '{name}',
          }}
          paint={{
            'text-color': '#c6acf3'
          }}
        />
      </Source>
    )

  }

  return (
    <>
    <Map
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_API}
      longitude={mapLongitude}
      latitude={mapLatitude}
      zoom={zoom}
      style={{ maxWidth: '100%', height: '100vh', cursor: 'crosshair!important' }}
      onMove={e => setViewState(e.viewState)}
      onClick={handleClick}
      mapStyle='mapbox://styles/innovatar/ckg6zpegq44ym19pen438iclf'
    >
      {/* { !triggerGeo ? <MapClickHint longitude={longitude} latitude={latitude} /> : null } */}
      <Cursor edit={modal?.placeForm === 'edit'}/>
      <Me setFollow={setFollow}/>
      <MapPlaces global={globalFeed}/>
      {/* { modal?.placeForm ? null : <MapPlaces global={globalFeed}/> } */}
      <FeedToggle globalFeed={globalFeed} toggleFeed={toggleFeed}/>
      { children }
      { geohash() }
    </Map>
    </>
  )
}
