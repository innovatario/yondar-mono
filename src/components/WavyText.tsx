import '../scss/WavyText.scss'

export const WavyText = ({ text='', emoji }: { text?: string, emoji?: string }) => {
  let chars = []
  if (emoji) {
    chars.push(emoji)
  }
  chars = chars.concat(text.split(''))
  const markup = chars.map((x, i) => {
    return (
      <span key={i} className={`wave-${i % 30}`}>
        {x}
      </span>
    )
  })

  return <span className='wavy-text'>{markup}</span>
}
