/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useState } from 'react'
import { useGeolocation } from '../hooks/useGeolocation'

export type GeolocationContextType = {
  position: GeolocationPosition | null
  cursorPosition: CursorPositionType
  setCursorPosition: (position: CursorPositionType) => void
}

export type CursorPositionType = {
  lng: number
  lat: number
} | null

const defaultGeolocationContext: GeolocationContextType = {
  position: null,
  cursorPosition: null,
  setCursorPosition: () => {},
}

export const GeolocationContext = createContext<GeolocationContextType>(defaultGeolocationContext)

type GeolocationProviderProps = {
  children: React.ReactNode
}

export const GeolocationProvider: React.FC<GeolocationProviderProps> = ({ children }) => {
  const [cursorPosition, setCursorPosition] = useState<CursorPositionType>(null)
  const [position] = useGeolocation(!!cursorPosition)

  return (
    <GeolocationContext.Provider value={{ position, cursorPosition, setCursorPosition }}>
      {children}
    </GeolocationContext.Provider>
  )
}
