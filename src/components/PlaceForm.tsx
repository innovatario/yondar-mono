import React, { Dispatch, SetStateAction, useEffect }  from 'react'
import { typeDropdown } from '../types/Place'
import '../scss/PlaceForm.scss'
import { FancyButton } from './FancyButton'

/* create a tsx form to handle input for a new place based on the examplePlace: 
const examplePlace = `
{
  "kind": 37515,
  "tags": [
    [ "d", "North Dakota Heritage Center & State Museum" ],
    [ "g", "cb266epj" ],
    [ "alt", "This event represents a place. View it on go.yondar.me/${exampleNaddr}" ]
  ],
  "content": {
    "type": "Feature",
    "properties": {
      "name": "North Dakota Heritage Center & State Museum",
      "abbrev": "Heritage Center",
      "description": "State history museum offering exhibits on the state's geologic prehistory, early peoples & culture.",
      "address": {
        "street-address": "612 E Boulevard Ave",
        "locality": "Bismarck",
        "region": "North Dakota",
        "country-name": "United States",
        "postal-code": "58505"
      },
      "type": "museum",
      "status": "OPERATIONAL",
      "website": "https://statemuseum.nd.gov/",
      "phone": "+1-701-328-2666",
      "hours": "Mo-Fr 08:00-17:00; Sa-Su 10:00-17:00"
    },
    "geometry": {
      "coordinates": [
        -100.77873491903246,
        46.81915362955226
      ],
      "type": "Point"
    }
  }
}`
*/

type PlaceFormProps = {
  edit?: boolean
}

export const PlaceForm: React.FC<PlaceFormProps> = ({edit = false}) => {
  // create a form to handle input for a new place based on the examplePlace. Do not take JSON - this form should be user-friendly.
  // use the following form fields:
  // name, abbrev, description, address, type, status, website, phone, hours
  // use the following HTML elements:
  // input, textarea, select, option, button
  // use the following React hooks:
  // useState, useEffect

  // refs for all fields 
  const nameRef = React.createRef<HTMLInputElement>()
  const abbrevRef = React.createRef<HTMLInputElement>()
  const descriptionRef = React.createRef<HTMLTextAreaElement>()
  const streetAddressRef = React.createRef<HTMLInputElement>()
  const localityRef = React.createRef<HTMLInputElement>()
  const regionRef = React.createRef<HTMLInputElement>()
  const countryNameRef = React.createRef<HTMLInputElement>()
  const postalCodeRef = React.createRef<HTMLInputElement>()
  const typeRef = React.createRef<HTMLSelectElement>()
  const statusRef = React.createRef<HTMLSelectElement>()


  return (
    <div id="component-placeform">
      <h1>{ edit ? "Edit your" : "Add a" } Place 📍</h1>
      { edit ? null : <p>Places can be edited later! They are replaceable events.</p> }
      <label htmlFor="name">Name</label>
      <input id="name" ref={nameRef} type="text" placeholder="Name of this Place" />
      <label htmlFor="abbrev">Abbreviation</label>
      <input id="abbrev" ref={abbrevRef} type="text" placeholder="Abbreviated (short) name" />
      <label htmlFor="description">Description</label>
      <textarea id="description" placeholder="A couple sentences to decribe the Place"></textarea>
      {/* street-address, locality, region, country-name, postal-code fields are under the Address area of the form */}
      <label htmlFor="address"><h2>Address Information<br/><small>(optional)</small></h2></label>
      <fieldset id="address">
        <label htmlFor="street-address">Street Address</label>
        <input id="street-address" type="text" placeholder="Street Address" />
        <label htmlFor="locality">City</label>
        <input id="locality" type="text" placeholder="City" />
        <label htmlFor="region">State</label>
        <input id="region" type="text" placeholder="State" />
        <label htmlFor="country-name">Country</label>
        <input id="country-name" type="text" placeholder="Country" />
        <label htmlFor="postal-code">Postal Code</label>
        <input id="postal-code" type="text" placeholder="Postal Code" />
      </fieldset>
      <label htmlFor="type">Type</label>
      { typeDropdown() }
      <br/>
      <FancyButton size={"lg"}>
        { edit ? "Edit" : "Publish" } Place
      </FancyButton>
      <br/>
      <br/>
    </div>
  )
}
