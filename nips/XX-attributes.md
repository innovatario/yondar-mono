NIP-XX Attributes
======

`draft` `optional`

Attributes Tag
-------

Arbitrary attributes (key=value pairs) may be used in any event kind with an `"attribute"` tag in the form of:

```json
"tags": [
  ["L", <namespace>]
  ["attribute", <key>, <value>, <namespace>]
]
```

The `"L"` tag MUST be present as specified in [NIP-32](https://github.com/nostr-protocol/nips/blob/master/32.md).

The `key` and `value` SHOULD be defined in the referenced namespace. The last element in the attribute tag MUST be a `namespace` defined in the `"L"` tag.

`key` MUST not be empty. If you are applying an attribute that requires only a `key` and no `value`, consider using a [NIP-32](https://github.com/nostr-protocol/nips/blob/master/32.md) label rather than using an empty string for the `value`.

Multiple `"attribute"` tags MAY be used in a single event. Multiple `"L"` tags MAY be used in a single event, but each namespace MUST be referenced by at least 1 attribute tag.

Attribute tags are not indexed by relays.

Attribution Event Kind 1987
--------

Kind `1987` MAY be used to apply attributes to other things rather than the event itself.

This is useful for defining attributes for non-nostr objects (like a podcast), crowdsourcing attributes (like for a Place), or updating attributes later for non-replaceable events that have already been published.

> [!note]
> All attribute tags apply to the event they exist on *_except_* for attributes on a kind `1987` event, which are applied to the entities referenced by one or more `e`, `a`, `p`, `t`, or `r` tags.

### Content
The `content` field MAY include a human-readable explanation or note for the attribution.

### Attribute Target
The attribution event MUST include one or more `e`, `a`, `p`, `t`, or `r` tags indicating
the object of the attribution, as specified in [NIP-32](https://github.com/nostr-protocol/nips/blob/master/32.md#label-target). This allows for attribution of events, people, topics, and relays
or external resources. As with NIP-01, a relay hint SHOULD be included when using `e` and
`p` tags.

### Examples

Crowdsourcing an attribute for wheelchair accessibility to an existing Place (kind 37515) using an OpenStreetMap (`osm`) tag:

```json
{
  "kind": 1987,
  "content": "Adding local observations regarding wheelchair accessibility at Coffee Shop.",
  "tags": [
    ["L", "osm"],
    ["attribute", "access:wheelchair", "yes", "osm"]
    ["a", "37515:0af3b...:Coffee Shop"]
  ],
}
```

Multiple attributes applied to a podcast episode. One is user-generated and the other is from the podcasting 2.0 taxonomy:

```json
{
  "kind": 1987,
  "content": "Ad-free episode! Be sure to support the creator!",
  "tags": [
    ["L", "ugc"]
    ["L", "podcast"]
    ["attribute", "advertising", "false", "ugc"]
    ["attribute", "funding", "payme@getalby.com", "podcast"]
    ["r", <podcast guid in a standard format>]
  ],
}
```

Implementations
--------

- go.yondar.me - used for adding OpenStreetMap tags and schema.org formatted data to Places
- nostrocket.org - used for crowdsourced categorizing of problems

References
---------

- NIP-32 https://github.com/nostr-protocol/nips/blob/master/32.md
- "NIP-85" https://github.com/nostr-protocol/nips/pull/879
