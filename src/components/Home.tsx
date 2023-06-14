import { SignInButton } from './SignInButton'
import { SignUpButton } from './SignUpButton'
import '../scss/Home.scss'

export const Home = () => {
  return (
    <div id="home">
      <div>
        <h1>Yondar.me</h1>
        <SignInButton/><SignUpButton/>
      </div>
    </div>
  )
}