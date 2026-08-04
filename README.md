# Alarmo Card Feature

Standalone Home Assistant Tile Card feature for the
[Alarmo integration](https://github.com/nielsfaber/alarmo).

The bundle provides:

- `custom:alarmo-card-feature` for Home Assistant Tile Cards
- `custom:alarmo-tile-card`, a standalone card containing only the feature
- configurable alarm-mode order
- PIN dialog using Home Assistant UI elements
- readiness indicators
- forced arming with bypassed-sensor display
- triggered-sensor display
- exit/entry-delay countdown as a filling disarm button

The original Alarmo Card is not required. Only the Alarmo integration and this
frontend resource are needed.

## Installation

Copy `dist/alarmo-card-feature.js` to:

```text
/config/www/alarmo-card-feature/alarmo-card-feature.js
```

Register the resource:

```yaml
lovelace:
  resources:
    - url: /local/alarmo-card-feature/alarmo-card-feature.js
      type: module
```

## Tile Card feature

```yaml
type: tile
entity: alarm_control_panel.alarmo
features_position: bottom
features:
  - type: custom:alarmo-card-feature
    name:
      - type: area
      - type: entity
    modes:
      - disarmed
      - armed_away
      - armed_home
```

For an inline Tile feature, use `features_position: inline`. Mode labels and
the additional sensor rows are hidden in the inline layout.

## Standalone card

```yaml
type: custom:alarmo-tile-card
entity: alarm_control_panel.alarmo
name:
  - type: area
  - type: entity
modes:
  - disarmed
  - armed_away
  - armed_home
```

## Development

```bash
npm install
npm run build
```

The minified bundle is written to `dist/alarmo-card-feature.js`.

## License

Apache-2.0
