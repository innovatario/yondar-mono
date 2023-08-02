import { Marker } from 'react-map-gl'
import { WavyText } from './WavyText'
import { FancyButton } from './FancyButton'
import '../scss/MapClickHint.scss'

type MapClickHintProps = {
  longitude: number,
  latitude: number,
}

export const MapClickHint: React.FC<MapClickHintProps> = ({longitude, latitude}) => {
  return (
    <Marker longitude={longitude} latitude={latitude} anchor={'center'}>
      <div id="map-hint">
        <FancyButton>
          <WavyText text="Click to allow GPS"/>
        </FancyButton>
      </div>
    </Marker>
  )
}