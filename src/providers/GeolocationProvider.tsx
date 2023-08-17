/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useState } from 'react'

type GeolocationProviderProps = {
  children: React.ReactNode
}

type GeolocationContextType = {
  position: GeolocationPosition | null
  setPosition: Function
  cursorPosition: CursorPositionType
  setCursorPosition: Function
}

export type CursorPositionType = {
  lng: number
  lat: number
} | null

const defaultGeolocationContext: GeolocationContextType = {
  position: null,
  setPosition: () => {},
  cursorPosition: null,
  setCursorPosition: () => {},
}

export const GeolocationContext = createContext<GeolocationContextType>(defaultGeolocationContext)

export const GeolocationProvider: React.FC<GeolocationProviderProps> = ({ children }) => {
  const [position, setPosition] = useState(null)
  const [cursorPosition, setCursorPosition] = useState(null)

  return (
    <GeolocationContext.Provider value={{ position, setPosition, cursorPosition, setCursorPosition }}>
      {children}
    </GeolocationContext.Provider>
  )
}
