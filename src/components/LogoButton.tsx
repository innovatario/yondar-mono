import { useState } from 'react'
import '../scss/LogoButton.scss'

type LogoButtonProps = {
  color?: string
  children?: React.ReactNode
}

export const LogoButton = ({ color = '#00aeef', children }: LogoButtonProps) => {
  const [toggle, setToggle] = useState<boolean>(false)

  const doToggle = () => setToggle(!toggle)

  const classes = 'button ' + (toggle ? 'active' : 'inactive')

  return (
    <div className='component-logobutton'>
      <div className={classes} onClick={doToggle}>
        <svg xmlns='http://www.w3.org/2000/svg' width='65' height='65'>
          <filter id='a' width='65' height='65' x='0' y='0' filterUnits='userSpaceOnUse'>
            <feOffset dy='3' />
            <feGaussianBlur result='b' stdDeviation='1.5' />
            <feFlood floodOpacity='.16' />
            <feComposite in2='b' operator='in' />
            <feComposite in='SourceGraphic' />
          </filter>
          <g transform='translate(5.88 2.88)'>
            <circle cx='26.62' cy='26.62' r='26.62' fill='#030504' />
            <path
              fill={color}
              d='M26.62 2.66A23.96 23.96 0 1 1 2.66 26.62 23.99 23.99 0 0 1 26.62 2.66m0-2.66a26.62 26.62 0 1 0 26.62 26.62A26.62 26.62 0 0 0 26.62 0z'
            />
          </g>
          <g filter='url(#a)'>
            <path
              fill='none'
              stroke='#000'
              d='M32.5 2.88A26.62 26.62 0 1 1 5.88 29.5 26.62 26.62 0 0 1 32.5 2.88m0-.88A27.5 27.5 0 1 0 60 29.5 27.53 27.53 0 0 0 32.5 2z'
            />
          </g>
          <g fill={color}>
            <path d='M43.5 34.83a1.1 1.1 0 0 1-.46-.3 3.55 3.55 0 0 1-.79-1.7 1.33 1.33 0 0 1 .98.26 1.45 1.45 0 0 1 .28 1.74z' />
            <path d='M46.18 27.15a1.03 1.03 0 0 0-1.31.63l-2.04 5.72a1.03 1.03 0 0 0 1.71 1.06 1.02 1.02 0 0 0 .23-.37l2.03-5.72a1.03 1.03 0 0 0-.62-1.32z' />
            <path d='M37.56 30.62l-.53 1.2.53 1.09a89.3 89.3 0 0 1 8.05-3.59l-.07-2.19a89.45 89.45 0 0 0-7.98 3.49zM45.92 26.2a.87.87 0 0 1 .24.25 4.41 4.41 0 0 1 .62 1.27 1.13 1.13 0 0 1 .06.21 1.17 1.17 0 0 1-.09.68l-.68-.45-.27-1.76z' />
          </g>
          <path
            fill={color}
            d='M35.3 29.78a1.03 1.03 0 0 0-1.42-.3 4.66 4.66 0 0 1-2.62.75 4.49 4.49 0 0 1-3.07-1.09A3.11 3.11 0 0 1 27 26.7v-7.32a1.03 1.03 0 1 0-2.05 0v7.32a5.13 5.13 0 0 0 1.9 4.01 6.55 6.55 0 0 0 4.41 1.6A6.75 6.75 0 0 0 35 31.2a1.03 1.03 0 0 0 .31-1.42z'
          />
          <path
            fill={color}
            d='M35.51 39.94V14.62a1.03 1.03 0 0 0-2.06 0V40a5.88 5.88 0 0 1-1.02 3.6 2.8 2.8 0 0 1-1.98 1 3.2 3.2 0 0 1-2.37-.73 3.75 3.75 0 0 1-.5-4.69 8.86 8.86 0 0 1 2.98-2.46l.86-.51V33.8l-.52-1.04a8.8 8.8 0 0 1-1.4 2.17 10.52 10.52 0 0 0-3.64 3.1 5.88 5.88 0 0 0 .84 7.34 5.12 5.12 0 0 0 3.45 1.28c.16 0 .32 0 .48-.02a4.87 4.87 0 0 0 3.43-1.78 7.79 7.79 0 0 0 1.45-4.92z'
          />
          <g fill='#fff'>
            <path d='M45.66 26.06a1.03 1.03 0 0 0-1.32.63l-2.03 5.72a1.03 1.03 0 1 0 1.94.69l2.03-5.72a1.03 1.03 0 0 0-.62-1.32z' />
            <path d='M37.03 29.53v2.29a89.3 89.3 0 0 1 8.05-3.59l-.07-2.19a89.92 89.92 0 0 0-7.98 3.49zM34.99 38.9V13.58a1.03 1.03 0 1 0-2.06 0v15.1a4.7 4.7 0 0 1-2.2.5 4.49 4.49 0 0 1-3.06-1.09 3.11 3.11 0 0 1-1.2-2.44v-7.33a1.03 1.03 0 0 0-2.06 0v7.33a5.13 5.13 0 0 0 1.91 4 6.55 6.55 0 0 0 4.41 1.6 6.98 6.98 0 0 0 2.2-.35v8.05a5.88 5.88 0 0 1-1.02 3.6 2.8 2.8 0 0 1-1.99 1 3.2 3.2 0 0 1-2.37-.74 3.75 3.75 0 0 1-.5-4.68 8.86 8.86 0 0 1 2.98-2.47l.86-.5v-2.39c-.7.4-1.33.77-1.92 1.13a10.53 10.53 0 0 0-3.64 3.1 5.88 5.88 0 0 0 .84 7.34 5.12 5.12 0 0 0 3.44 1.28c.16 0 .33-.01.49-.03a4.87 4.87 0 0 0 3.43-1.77 7.79 7.79 0 0 0 1.46-4.92z' />
          </g>
        </svg>
      </div>
      { toggle ? (<div className='component-logobutton-menu'>
        { children }
      </div>
      ) : null }
    </div>
  )
}
