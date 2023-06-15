import { createContext } from 'react'
import { IdentityType, IdentityContextType, defaultIdentityContext } from '../types/IdentityType.tsx'
import usePersistedState from '../hooks/usePersistedState'

const STALE_PROFILE = 1000 * 60 * 60 * 24 * 7

type IdentityProviderProps = {
  children: React.ReactNode
}

export const IdentityContext = createContext<IdentityContextType>(defaultIdentityContext)

export const IdentityProvider: React.FC<IdentityProviderProps> = ({children})=> {
  const [identity, setIdentity] = usePersistedState<IdentityType>('identity', null)

  const isIdentityFresh = (): boolean => {
    if (identity?.last_updated && +new Date() - identity.last_updated < STALE_PROFILE) {
      return true 
    }
    return false
  }

  return (
    <IdentityContext.Provider value={{identity, setIdentity, isIdentityFresh}}>
      {children}
    </IdentityContext.Provider>
  )
}