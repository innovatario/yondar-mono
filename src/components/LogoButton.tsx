import { useState } from 'react'
import '../scss/LogoButton.scss'
import { YLogo } from './YLogo'

type LogoButtonProps = {
  color?: string
  children?: React.ReactNode
}

export const LogoButton = ({ color = '#00aeef', children }: LogoButtonProps) => {
  const [toggle, setToggle] = useState<boolean>(false)

  const doToggle = () => setToggle(!toggle)

  const outerClasses = 'component-logobutton ' + (toggle ? 'active' : 'inactive') 
  const classes = 'button ' + (toggle ? 'active' : 'inactive')

  return (
    <div className={outerClasses} onClick={doToggle}>
      <div className={classes}>
        <YLogo color={color}/>
      </div>
      { toggle ? (<div className='component-logobutton-menu'>
        { children }
      </div>
      ) : null }
    </div>
  )
}
