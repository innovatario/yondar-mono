import { Event, EventTemplate } from "nostr-tools"

export type NostrWindow = {
  getPublicKey(): Promise<string>
  signEvent(event: EventTemplate) : Promise<Event>
}