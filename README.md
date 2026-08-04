# HA Alarmo Tile Feature

A Home Assistant Tile Card feature for the
[Alarmo integration](https://github.com/nielsfaber/alarmo), plus a standalone
card containing the same controls.

The original Alarmo Card is not required. This frontend resource communicates
directly with the Alarmo integration and does not modify it.

## Features

- `custom:ha_alarmo-card-feature` for native Home Assistant Tile Cards
- `custom:alarmo-tile-card` as a standalone card
- Configurable alarm-mode selection and order
- Home Assistant-style mode controls and readiness badges
- PIN dialog using Home Assistant UI components
- Forced arming with bypassed-sensor information
- Triggered- and bypassed-sensor information with configurable Home Assistant entity names
- Filling countdown for exit and entry delays
- Separate `Activate`, `Trigger`, and `Disarm` countdown states with matching
  colors and icons
- Bottom and inline Tile feature layouts

## Requirements

- Home Assistant 2026.5.0 or newer
- The [Alarmo integration](https://github.com/nielsfaber/alarmo)

The original Alarmo Card is not a dependency.

## HACS installation

[![Open your Home Assistant instance and open this repository in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=psym88&repository=ha_alarmo-card-feature&category=plugin)

1. Open HACS and select **Custom repositories** from the three-dot menu.
2. Add `https://github.com/psym88/ha_alarmo-card-feature` with the
   **Dashboard** category.
3. Install **HA Alarmo Tile Feature**.
4. Reload Home Assistant and clear the browser cache if necessary.

HACS normally registers this resource automatically:

```text
/hacsfiles/ha_alarmo-card-feature/ha_alarmo-card-feature.js?hacstag=…
```

## Tile Card feature

```yaml
type: tile
entity: alarm_control_panel.alarmo
features_position: bottom
features:
  - type: custom:ha_alarmo-card-feature
    modes:
      - disarmed
      - armed_away
      - armed_home
```

The order of `modes` determines the button order. Supported values are:

- `disarmed`
- `armed_home`
- `armed_away`
- `armed_night`
- `armed_vacation`
- `armed_custom_bypass`

With `features_position: inline`, only icons are shown. Triggered and bypassed
sensor information is only shown in the bottom layout.

## Sensor names

The official Home Assistant `name` configuration controls how entity names are
composed under **Triggered by** and **Bypassed sensors**. Components are
displayed in YAML order:

```yaml
features:
  - type: custom:ha_alarmo-card-feature
    name:
      - type: area
      - type: entity
      - type: floor
      - type: device
```

Custom text can be combined with contextual names:

```yaml
name:
  - type: area
  - type: text
    text: Window
  - type: entity
```

Without `name`, the entity's friendly name is displayed.

## Standalone card

The same controls can be used without a parent Tile Card:

```yaml
type: custom:alarmo-tile-card
entity: alarm_control_panel.alarmo
modes:
  - disarmed
  - armed_away
  - armed_home
name:
  - type: area
  - type: entity
```

## Configuration

| Option | Applies to | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `entity` | Standalone card | Yes | — | Alarmo `alarm_control_panel` entity |
| `modes` | Both | No | Supported modes | Visible modes in display order |
| `name` | Both | No | Friendly name | Home Assistant name configuration for triggered and bypassed sensors |

The Tile feature receives its entity from the parent Tile Card and therefore
does not accept a separate `entity` option.

## Alarm states

- **Activate** (green): Alarmo is in the exit-delay `arming` state.
- **Trigger** (red): A sensor started the entry-delay `pending` state.
- **Disarm** (red): Alarmo is in the active `triggered` state.

The countdown button can be used to cancel or disarm these states. Arming calls
use Alarmo's `force` option, so required sensors can be bypassed. Bypassed
sensors are listed below the controls in the bottom layout.

## Manual installation

1. Download `ha_alarmo-card-feature.js` from the latest GitHub release.
2. Copy it to `/config/www/ha_alarmo-card-feature/ha_alarmo-card-feature.js`.
3. Register it as a JavaScript module:

```yaml
lovelace:
  resources:
    - url: /local/ha_alarmo-card-feature/ha_alarmo-card-feature.js
      type: module
```

## Development

```bash
npm install
npm run build
```

The minified bundle is written to `dist/ha_alarmo-card-feature.js`.

## License

[Apache-2.0](LICENSE)
