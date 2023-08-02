import '../scss/FancyButton.scss'

type FancyButtonProps = {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export const FancyButton: React.FC<FancyButtonProps> = ({children, size = 'sm'}: FancyButtonProps) => {
  const classes = `fancybutton ${size}`
  return (
    <button className={classes}>
      {children}
    </button>
  )
}