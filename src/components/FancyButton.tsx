import '../scss/FancyButton.scss'

type FancyButtonProps = {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  status?: '' | 'success' | 'neutral' | 'warning' | 'plain'
  style?: React.CSSProperties
}

export const FancyButton: React.FC<FancyButtonProps> = ({children, size = 'sm', onClick, status = '', style = {}}: FancyButtonProps) => {
  const classes = `fancybutton ${size} ${status}`
  return (
    <button className={classes} onClick={onClick} style={style}>
      {children}
    </button>
  )
}