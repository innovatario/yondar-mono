// offsets for when the beacon is expanded
export const getLongitudeOffset = () => {
  const width = window.innerWidth / 135 / 10000
  return 0.00110 + width
}

export const getLatitudeOffset = () => {
  return -0.0010
}


export function pixelDistance(map, lng1, lat1, lng2, lat2) {

  // Calculate the distance between the two points in pixels
  const { x: x1, y: y1 } = map.project([lng1, lat1])
  const { x: x2, y: y2 } = map.project([lng2, lat2])
  const pixelDistance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

  return pixelDistance
}

export function pixelsToEms(pixelDistance: number) {

  // Convert the pixel distance to em units
  const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
  const emDistance = pixelDistance / fontSize

  return emDistance
}