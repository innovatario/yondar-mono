import { createContext } from 'react'
import { DraftPlace } from '../types/Place'
import usePersistedState from '../utils/usePersistedState'

const defaultPlace: DraftPlace = {
  kind: 37515,
  tags: [["d","New Place"],["g",""],["alt","This event represents a place. View it on go.yondar.me/"]],
  content: {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [0,0]
    },
    properties: {
      name: "New Place",
      description: "A new place on the map",
      type: "point_of_interest",
    }
  }
}

export const DraftPlaceContext = createContext<DraftPlace>(defaultPlace)