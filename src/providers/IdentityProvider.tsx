import { createContext } from 'react'
import { IdentityType, IdentityContextType, defaultIdentityContext } from '../types/IdentityType.tsx'
import usePersistedState from '../hooks/usePersistedState'

type IdentityProviderProps = {
  children: React.ReactNode
}

export const IdentityContext = createContext<IdentityContextType>(defaultIdentityContext)

export const IdentityProvider: React.FC<IdentityProviderProps> = ({children})=> {
  const [identity, setIdentity] = usePersistedState<IdentityType>('identity', null)
  return (
    <IdentityContext.Provider value={{identity, setIdentity}}>
      {children}
    </IdentityContext.Provider>
  )
}