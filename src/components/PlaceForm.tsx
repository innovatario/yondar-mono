import React, { useContext, useState, useEffect, useRef } from "react";
import { useGeolocationData } from "../hooks/useGeolocationData";
import {
  typeDropdown,
  DraftPlace,
  GooglePlaceType,
  GooglePlaceStatus,
  requiredProperties,
  SignableDraftPlace,
} from "../types/Place";
import { IdentityContext } from "../providers/IdentityProvider";
import { IdentityContextType } from "../types/IdentityType";
import { ModalContextType } from "../types/ModalType";
import { ModalContext } from "../providers/ModalProvider";
import { DraftPlaceContext } from "../providers/DraftPlaceProvider";
import { DraftPlaceContextType } from "../types/Place";
import { freshDefaultPlace } from "../libraries/defaultPlace";
import { FancyButton } from "./FancyButton";
import { nip19 } from "nostr-tools";
import "../scss/PlaceForm.scss";
import { defaultRelays, pool } from "../libraries/Nostr";
import Geohash from "latlon-geohash";
import { signEvent } from "../libraries/NIP-07";

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
  edit?: boolean;
};

export const PlaceForm: React.FC<PlaceFormProps> = ({ edit = false }) => {
  const { identity } = useContext<IdentityContextType>(IdentityContext);
  const { draftPlace, setDraftPlace } =
    useContext<DraftPlaceContextType>(DraftPlaceContext);
  const { cursorPosition } = useGeolocationData();
  const { modal } = useContext<ModalContextType>(ModalContext);

  // state for name field value so we can get an updated naddr
  const [naddr, setNaddr] = useState<string>("");

  // state to refresh form on reset
  const [formKey, setFormKey] = useState<number>(0)

  // refs for all fields
  const nameRef = useRef<HTMLInputElement>(null);
  const abbrevRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const streetAddressRef = useRef<HTMLInputElement>(null);
  const localityRef = useRef<HTMLInputElement>(null);
  const regionRef = useRef<HTMLInputElement>(null);
  const countryNameRef = useRef<HTMLInputElement>(null);
  const postalCodeRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const statusRef = useRef<HTMLSelectElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  // get naddr
  useEffect(() => {
    const naddr = nip19.naddrEncode({
      pubkey: identity.pubkey,
      relays: defaultRelays,
      kind: 37515,
      identifier: draftPlace.content.properties.name || "",
    })

    setNaddr(naddr)
  }, [identity.pubkey, draftPlace])

  console.log("naddr", naddr)

  // get geohash from coordinates from latlong-geohash library
  const geohash = Geohash.encode(cursorPosition.lat, cursorPosition.lng, 5)

  /**
   * 
   * @returns a DraftPlace object based on the form data
   */
  const createDraftPlace = () => {
    const newPlace: DraftPlace = {
      kind: 37515,
      tags: [
        ["d", nameRef.current?.value],
        ["g", geohash],
        [
          "alt",
          `This event represents a place. View it on https://go.yondar.me/place/${naddr}`,
        ],
      ],
      content: {
        type: "Feature",
        geometry: {
          coordinates: [cursorPosition.lng, cursorPosition.lat],
          type: "Point",
        },
        properties: {
          name: nameRef.current?.value || "",
          abbrev: abbrevRef.current?.value || "",
          description: descriptionRef.current?.value || "",
          address: {
            "street-address": streetAddressRef.current?.value || "",
            locality: localityRef.current?.value || "",
            region: regionRef.current?.value || "",
            "country-name": countryNameRef.current?.value || "",
            "postal-code": postalCodeRef.current?.value || "",
          },
          type: (typeRef.current?.value || "") as GooglePlaceType,
          status: (statusRef.current?.value || "") as GooglePlaceStatus,
          website: websiteRef.current?.value || "",
          phone: phoneRef.current?.value || "",
        },
      },
    }
    return newPlace
  }

  const updateDraft = () => {
    const newPlace = createDraftPlace()
    setDraftPlace(newPlace)
  }

  const resetForm = () => {
    setDraftPlace(freshDefaultPlace())
    setFormKey(formKey + 1)
  }

  const publish = async () => {
    // create an event from the form data conforming to the type DraftPlace
    if (!nameRef.current?.value) return // name is required
    if (!cursorPosition) return // this should never happen

    const newPlace = createDraftPlace()

    // eliminate empty optional fields
    Object.keys(newPlace.content.properties).forEach((key) => {
      if (
        !requiredProperties.includes(key) &&
        newPlace.content.properties[key] === ""
      ) {
        delete newPlace.content.properties[key]
      }
    });
    // eliminate empty fields from address property, and eliminate the address property altogether if it is totally full of empty fields:
    Object.keys(newPlace.content.properties.address).forEach((key) => {
      if (newPlace.content.properties.address[key] === "") {
        delete newPlace.content.properties.address[key]
      }
    });
    if (Object.keys(newPlace.content.properties.address).length === 0) {
      delete newPlace.content.properties.address
    }

    // stringify content property
    const signableDraftPlace: SignableDraftPlace = {
      ...newPlace,
      content: JSON.stringify(newPlace.content),
      created_at: Math.floor(Date.now() / 1000),
      pubkey: identity.pubkey,
    }

    // publish the event
    const signedEvent = await signEvent(signableDraftPlace)

    const pub = pool.publish(defaultRelays, signedEvent)
    pub.on("ok", () => {
      console.log("Event published successfully!")
      // TODO: clear form, show success message, close modal, happy animation, zoom in on new place?
      modal?.setPlaceForm(false);
    })
    pub.on("failed", (reason: string) => {
      console.error(`Failed to publish event. ${reason}`)
    })
  }

  return (
    <div id="component-placeform" key={formKey}>
      <button style={{float: 'right'}} onClick={resetForm}>Reset Form</button>
      <h1>{edit ? "Edit your" : "Add a"} Place 📍</h1>
      {edit ? null : (
        <p>Places can be edited later! They are replaceable events.</p>
      )}
      <label htmlFor="name">Name</label>
      <input
        required={true}
        id="name"
        ref={nameRef}
        defaultValue={draftPlace.content.properties.name || ""}
        type="text"
        placeholder="Name of this Place"
        onChange={() => updateDraft()}
      />
      <label htmlFor="abbrev">Abbreviation</label>
      <input
        id="abbrev"
        ref={abbrevRef}
        defaultValue={draftPlace.content.properties.abbrev || ""}
        type="text"
        placeholder="Abbreviated (short) name"
        onChange={() => updateDraft()}
      />
      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        ref={descriptionRef}
        defaultValue={draftPlace.content.properties.description || ""}
        placeholder="A couple sentences to decribe the Place"
        onChange={() => updateDraft()}
      ></textarea>
      <label htmlFor="address">
        <h2>
          Address Information
          <br />
          <small>(optional)</small>
        </h2>
      </label>
      <fieldset id="address">
        <label htmlFor="street-address">Street Address</label>
        <input
          id="street-address"
          ref={streetAddressRef}
          defaultValue={
            draftPlace.content.properties.address?.["street-address"] || ""
          }
          type="text"
          placeholder="Street Address"
          onChange={() => updateDraft()}
        />
        <label htmlFor="locality">City</label>
        <input
          id="locality"
          ref={localityRef}
          defaultValue={draftPlace.content.properties.address?.locality || ""}
          type="text"
          placeholder="City"
          onChange={() => updateDraft()}
        />
        <label htmlFor="region">State</label>
        <input
          id="region"
          ref={regionRef}
          defaultValue={draftPlace.content.properties.address?.region || ""}
          type="text"
          placeholder="State"
          onChange={() => updateDraft()}
        />
        <label htmlFor="country-name">Country</label>
        <input
          id="country-name"
          ref={countryNameRef}
          defaultValue={draftPlace.content.properties.address?.["country-name"] || ""}
          type="text"
          placeholder="Country"
          onChange={() => updateDraft()}
        />
        <label htmlFor="postal-code">Postal Code</label>
        <input
          id="postal-code"
          ref={postalCodeRef}
          defaultValue={draftPlace.content.properties.address?.["postal-code"] || ""}
          type="text"
          placeholder="Postal Code"
          onChange={() => updateDraft()}
        />
      </fieldset>
      <label htmlFor="type">Type</label>
      {typeDropdown(typeRef, draftPlace.content.properties.type || "", updateDraft)}
      <label htmlFor="status">Status</label>
      <select
        id="status"
        ref={statusRef}
        defaultValue={draftPlace.content.properties.status || ""}
        onChange={() => updateDraft()}
      >
        <option value="OPERATIONAL">Operational</option>
        <option value="CLOSED_TEMPORARILY">Closed Temporarily</option>
        <option value="CLOSED_PERMANENTLY">Closed Permanently</option>
      </select>
      <label htmlFor="website">Website</label>
      <input
        id="website"
        ref={websiteRef}
        defaultValue={draftPlace.content.properties.website || ""}
        type="text"
        placeholder="https://yondar.me"
        onChange={() => updateDraft()}
      />
      <label htmlFor="phone">Phone</label>
      <input
        id="phone"
        ref={phoneRef}
        defaultValue={draftPlace.content.properties.phone || ""}
        type="text"
        placeholder="+1 123 456 7890"
        onChange={() => updateDraft()}
      />
      <br />
      <FancyButton size={"lg"} onClick={publish}>
        {edit ? "Edit" : "Publish"} Place
      </FancyButton>
      <br />
      <br />
    </div>
  );
};