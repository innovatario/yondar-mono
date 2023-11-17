import { SignInButton } from './SignInButton'
import { SignUpButton } from './SignUpButton'
import '../scss/Home.scss'
import logo from '../assets/yondar-logo-full-beta.svg'
import { FAQ } from './FAQ'
import { Dataspace } from './Dataspace'
import { Footer } from './Footer'
import { useLocation } from 'react-router-dom'
import { PlacePreview } from './PlacePreview'
import { useNaddr } from '../hooks/useNaddr'
import { NsecSignInButton } from './NsecSigninButton'
import { IdentityContext } from '../providers/IdentityProvider'
import { IdentityContextType } from '../types/IdentityType'
import { useContext } from 'react'
import { LoginButton } from './LoginButton'

export const Home = () => {
  const { search } = useLocation()
  const { naddr } = useNaddr()
  const params = new URLSearchParams(search)
  const pleaseLogin = params.get('pleaseLogin') === 'true'

  const showPreview = naddr && pleaseLogin ? <PlacePreview/> : null
  const { identity } = useContext<IdentityContextType>(IdentityContext)
  const loginButton = identity ? <LoginButton /> : null

  return (
    <div id="home">
      <div className="wrapper mb-0">
        <img className="logo" src={ logo } alt="Yondar Logo" />
        <br/>
      </div>
      {showPreview ? (
        showPreview
      ) : (
        <div className="button-row">
          {loginButton || (
            <>
            <SignInButton/><NsecSignInButton /><br></br><SignUpButton />   
          
            </>
          )}
        </div>
      )}
      <div className="wrapper subsequent">
        <FAQ/>
        <Dataspace/>
        <Footer/>
      </div>
    </div>
  )
}