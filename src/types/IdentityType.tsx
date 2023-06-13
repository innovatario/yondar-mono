export type IdentityType = {
  pubkey: string
  name?: string
  username?: string
  display_name?: string
  displayName?: string
  about?: string
  nip05?: string
  website?: string
  picture?: string
  banner?: string
  lud16?: string
  [key: string]: string | undefined
} | null

export type IdentityContextType = {
  identity: IdentityType,
  // eslint-disable-next-line @typescript-eslint/ban-types
  setIdentity: Function,
}

export const defaultIdentityContext: IdentityContextType = {
  identity: null,
  setIdentity: () => {}
}