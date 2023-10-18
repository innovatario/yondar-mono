/* eslint-disable @typescript-eslint/no-empty-function */
import { useState, createContext } from 'react'

type ModeProviderProps = {
  children: React.ReactNode;
}

type Mode = 'add' | 'chat' | null

export type ModeContextType = {
  mode: Mode,
  setMode: (mode: Mode) => void
}

const defaultModeContext: ModeContextType = {
  mode: null,
  setMode: () => {},
}

export const ModeContext = createContext<ModeContextType>(defaultModeContext)

export const ModeProvider: React.FC<ModeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<Mode>(null)

  return (
    <ModeContext.Provider value={{mode, setMode}}>
      {children}
    </ModeContext.Provider>
  )
}