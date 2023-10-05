/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useState } from 'react'

interface NaddrContextType {
  naddr: string
  setNaddr: (naddr: string) => void
}

export const NaddrContext = createContext<NaddrContextType>({
  naddr: '',
  setNaddr: () => {}
})

export const NaddrProvider = ({ children }: { children: React.ReactNode }) => {
  const [naddr, setNaddr] = useState<string>('')

  return (
    <NaddrContext.Provider value={{ naddr, setNaddr }}>
      {children}
    </NaddrContext.Provider>
  )
}