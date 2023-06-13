import { NostrWindow } from '../types/NostrWindow'

// This declaration allows us to access window.nostr without TS errors.
// https://stackoverflow.com/a/47130953
declare global {
    interface Window {
        nostr: NostrWindow;
    }
}

/**
 * Try/catch wrapper for window.nostr.getPublicKey
 * nostr.getPublicKey can error if no key has been set up yet.
 * @returns pubkey:string|null
 */
export const getPublicKey = async (): Promise<string|null> => {
  let pubkey: string
  try {
    pubkey = await window.nostr.getPublicKey()
    console.log(pubkey)
    return pubkey
  } catch (e) {
    console.log('getPublicKey() failed:',e)
    return null
  }
}