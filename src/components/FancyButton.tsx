import '../scss/FancyButton.scss'

type FancyButtonProps = {
  className?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  status?: '' | 'success' | 'neutral' | 'warning' | 'plain'
  style?: React.CSSProperties
}

export const FancyButton: React.FC<FancyButtonProps> = ({children, className = '', size = 'sm', onClick, status = '', style = {}}: FancyButtonProps) => {
  const classes = `fancybutton ${size} ${status} ${className}`
  return (
    <button className={classes} onClick={onClick} style={style}>
      {children}
    </button>
  )
}