import { useContext, useState } from 'react'
import '../scss/LogoButton.scss'
import { YLogo } from './YLogo'
import { IdentityContextType } from '../types/IdentityType'
import { IdentityContext } from '../providers/IdentityProvider'
import yondarlogo from '../assets/Yondar-Icon.png'

type LogoButtonProps = {
  color?: string
  children?: React.ReactNode
}

export const Identity = ({ color = '#00aeef', children }: LogoButtonProps) => {
  const [toggle, setToggle] = useState<boolean>(false)
  const { identity } = useContext<IdentityContextType>(IdentityContext)

  const doToggle = () => setToggle(!toggle)

  const outerClasses = 'component-logobutton ' + (toggle ? 'active' : 'inactive') 
  const classes = 'button ' + (toggle ? 'active' : 'inactive')

  const menu = (
    <div className='component-logobutton-menu'>
      <div className='wrapper'>
        { children }
      </div>
    </div>
  )

  const profilepic = <img src={identity?.picture} width={65} height={65} />
  const defaultpic = <img className="default" src={yondarlogo} width={65} height={65}/>

  return (
    <div className={outerClasses}>
      { toggle ? menu : null }
      <div className={classes} onClick={doToggle}>
        { identity?.picture ? profilepic : defaultpic }
      </div>
    </div>
  )
}
