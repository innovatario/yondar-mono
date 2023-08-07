import { createContext } from 'react'
import { DraftPlace } from '../types/Place'
import usePersistedState from '../hooks/usePersistedState'

const defaultPlace: DraftPlace = {
  kind: 37515,
  tags: [
    ["d","New Place"],
    ["g",""],
    ["alt","This event represents a place. View it on go.yondar.me/"]
  ],
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

type DraftPlaceProviderProps = {
  children: React.ReactNode
}

export const DraftPlaceContext = createContext<DraftPlace>(defaultPlace)

export const DraftPlaceProvider: React.FC<DraftPlaceProviderProps> = ({children})=> {
  const [draftPlace, setDraftPlace] = usePersistedState<DraftPlace>('draftPlace', defaultPlace)

  return (
    <DraftPlaceContext.Provider value={draftPlace}>
      {children}
    </DraftPlaceContext.Provider>
  )
}