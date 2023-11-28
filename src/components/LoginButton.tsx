
import { useNavigate } from 'react-router-dom'
import { WavyText } from './WavyText'
import { useContext } from 'react'
import { IdentityContextType } from "../types/IdentityType"
import { IdentityContext } from "../providers/IdentityProvider"

export const LoginButton = () => {
    const { identity } = useContext<IdentityContextType>(IdentityContext)
    const navigate = useNavigate()
    if(!identity) return
    return (
      <div className="column">
      You are already signed in!
        <br/>
        <br/>
          <button className="fancybutton md" type='button' onClick={() => navigate('/login')}><WavyText text="Go Yondar"/></button>
        <br/>
      </div>
    )
}