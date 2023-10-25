
import { useContext } from 'react'
import { NavigationTargetContext } from '../providers/NavigationTargetProvider'

export const useNavigationTarget = () => {
  return useContext(NavigationTargetContext)
}