import { useState, useEffect } from 'react'

export const useGeolocation = () => {
  const [position, setPosition] = useState<GeolocationPosition | null>(null)
  const [error, setError] = useState<GeolocationPositionError | null>(null)

  useEffect(() => {
    const geo = navigator.geolocation
    if (!geo) {
      setError({
        code: 2,
        message: 'Geolocation is not supported',
      } as GeolocationPositionError)
      return
    }

    const watcher = geo.watchPosition(setPosition, setError)

    return () => geo.clearWatch(watcher)
  }, [])

  return { position, error }
}

export const validGeolocation = ( position: GeolocationPosition | null) => {
  if (position?.coords && position.coords.longitude && position.coords.latitude) {
    return true
  }
  return false
}