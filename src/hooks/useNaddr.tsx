import { useContext } from 'react'
import { NaddrContext } from '../providers/NaddrProvider'

export const useNaddr = () => {
  return useContext(NaddrContext)
}
