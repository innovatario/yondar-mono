/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from 'react'

type GeolocationProviderProps = {
  children: React.ReactNode
}

type GeolocationContextType = {
  position: GeolocationPosition | null
  setPosition: Function
}

const defaultGeolocationContext: GeolocationContextType = {
  position: null,
  setPosition: () => {},
}

const GeolocationContext = createContext<GeolocationContextType>(defaultGeolocationContext)

export const useGeolocationData = () => {
  return useContext(GeolocationContext)
}

export const GeolocationProvider: React.FC<GeolocationProviderProps> = ({ children }) => {
  const [position, setPosition] = useState(null)

  return (
    <GeolocationContext.Provider value={{ position, setPosition }}>
      {children}
    </GeolocationContext.Provider>
  )
}
