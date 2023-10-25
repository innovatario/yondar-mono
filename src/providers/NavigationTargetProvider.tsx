
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useState } from 'react'

type LngLatArray = [number, number]

interface NavigationTargetContextType {
  target: LngLatArray | null // [lng: number, lat: number]
  setTarget: (target: LngLatArray) => void
}

export const NavigationTargetContext = createContext<NavigationTargetContextType>({
  target: null,
  setTarget: () => {}
})

export const NavigationTargetProvider = ({ children }: { children: React.ReactNode }) => {
  const [target, setTarget] = useState<LngLatArray|null>(null)

  console.log('target updated:', target)

  return (
    <NavigationTargetContext.Provider value={{ target, setTarget }}>
      {children}
    </NavigationTargetContext.Provider>
  )
}