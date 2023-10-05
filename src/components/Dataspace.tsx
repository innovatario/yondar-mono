import dspace from '../assets/dataspace-alpha-white.png'
import "../scss/Dataspace.scss"

export const Dataspace = () => {
  return (
    <div className="component-footer dataspace">
      Yondar is a <em>Dataspace</em> client. Read more about the decentralized open-source XR metaverse powered by proof-of-work: <a href="https://github.com/arkin0x/cyberspace" target="_blank" rel="noopener noreferrer">Cyberspace Meta-Protocol</a>.
      <br/>
      <br/>
      <img src={dspace} alt="Dataspace symbol"/>
    </div>
  )
}