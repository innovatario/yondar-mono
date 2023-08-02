import { useNavigate } from 'react-router-dom'

export const NewPlaceButton = () => {
  const navigate = useNavigate()
  const goPublish = () => {
    navigate('/publish')
  }
  return (
    <button onClick={goPublish}>Create a Place</button>
  )
}
