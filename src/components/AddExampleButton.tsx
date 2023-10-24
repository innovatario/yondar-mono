import {useState} from 'react'
import { FaMapPin } from 'react-icons/fa'

export const AddExampleButton = () => {
  const [boop, setBoop] = useState<number|undefined>()
  const handleClick = () => {
    if (typeof boop === 'undefined')
      setBoop( setTimeout( () => {
          setBoop(undefined)
        }, 1000)
      )
  }
  return (
    <>
      <button onClick={handleClick} className={`component-example-addbutton`} style={{
        alignItems: 'center',
        backgroundColor: '#ff0037',
        borderRadius: '50%',
        border: '2px solid #b10732',
        bottom: '2rem',
        boxShadow: '5px 5px 5px 0px rgba(0,0,0,0.5)',
        color: '#ffffff',
        cursor: 'pointer',
        display: 'flex',
        height: '50px',
        width: '50px',
        justifyContent: 'center',
        outline: 'none',
        padding: '7px',
      }}>
        <FaMapPin size={30} />
      </button>
      { boop ? <div className="component-shared" style={{width: '50px', marginLeft: '1rem', marginTop: '-3rem', cursor: 'pointer', fontSize: '30px', animation: 'floatUp 1s ease-in-out'}}>
        Boop!
      </div> : null }
    </>
  )
}
