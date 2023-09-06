import { SignInButton } from './SignInButton'
import { SignUpButton } from './SignUpButton'
import '../scss/Home.scss'
import logo from '../assets/yondar-logo-full-beta.svg'
import { FAQ } from './FAQ'

export const Home = () => {
  return (
    <div id="home">
      <div className="wrapper">
        <img className="logo" src={ logo } alt="Yondar Logo" />
        <br/>
        <div className="button-row">
          <SignInButton/><SignUpButton/>
        </div>
        <div className="faq">
          <FAQ/>
        </div>
      </div>
    </div>
  )
}