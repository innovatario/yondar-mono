import { useState } from 'react'
import '../scss/LogoButton.scss'
import { YLogo } from './YLogo'

type LogoButtonProps = {
  color?: string
  children?: React.ReactNode
}

export const Identity = ({ color = '#00aeef', children }: LogoButtonProps) => {
  const [toggle, setToggle] = useState<boolean>(false)

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

  return (
    <div className={outerClasses}>
      { toggle ? menu : null }
      <div className={classes} onClick={doToggle}>
        <YLogo color={color}/>
      </div>
    </div>
  )
}
