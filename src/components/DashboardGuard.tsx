import { useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IdentityContext } from '../providers/IdentityProvider'
import { Dashboard } from './Dashboard'
import { useNaddr } from '../hooks/useNaddr'

export const DashboardGuard = () => {
  const { naddr }: { naddr?: string } = useParams<{ naddr?: string }>()
  const { setNaddr } = useNaddr()
  const { isIdentityFresh } = useContext(IdentityContext)
  const navigate = useNavigate()

  // if the URL is /place/:naddr, save it into the context
  useEffect( () => {
    if (naddr) {
      // Set naddr; 
      setNaddr(naddr)
    }
  }, [naddr, setNaddr])

  if (!isIdentityFresh()) {
    // Redirect to the login page if the user is not logged in
    navigate('/?pleaseLogin=true')
    return null
  }

  // Render the Dashboard component if the user is logged in
  return <Dashboard />
}