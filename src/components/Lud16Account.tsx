import React from 'react'
import '../scss/_globals.scss'


interface Lud16AccountProps {
    lud16: string | null | undefined;
}

export const Lud16Account: React.FC<Lud16AccountProps> = ({ lud16 }) => {

  return (
    <>
      {lud16 && (
        <>
        <a href={`lightning:${lud16}`}> ⚡ </a>
        </>
      )}
    </>
  )
}