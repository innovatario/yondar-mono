
// offsets for when the beacon is expanded
export const getLongitudeOffset = () => {
  const width = window.innerWidth / 135 / 10000
  return 0.00110 + width
}

export const getLatitudeOffset = () => {
  return -0.0010
}

