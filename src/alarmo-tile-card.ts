import { css, html, LitElement, nothing, PropertyValues } from 'lit';
import { AlarmoCardFeature } from './features/alarmo-card-feature';

type AlarmMode = 'armed_home' | 'armed_away' | 'armed_night' | 'armed_vacation' | 'armed_custom_bypass' | 'disarmed';

type EntityNameItem =
  | string
  | { type: 'entity' | 'device' | 'area' | 'floor' }
  | { type: 'text'; text: string };

type EntityNameConfig = string | EntityNameItem | EntityNameItem[];

type AlarmoTileCardConfig = {
  type: 'custom:ha_alarmo-tile-card';
  entity: string;
  modes?: AlarmMode[];
  name?: EntityNameConfig;
};

type HomeAssistant = {
  states: Record<string, { entity_id: string; state: string }>;
};

export class AlarmoTileCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  public hass?: HomeAssistant;

  private _config?: AlarmoTileCardConfig;

  public static getStubConfig(hass: HomeAssistant): AlarmoTileCardConfig {
    return {
      type: 'custom:ha_alarmo-tile-card',
      entity: Object.keys(hass.states).find((entityId) => entityId.startsWith('alarm_control_panel.')) || '',
    };
  }

  public setConfig(config: AlarmoTileCardConfig): void {
    if (!config?.entity?.startsWith('alarm_control_panel.')) {
      throw new Error('An alarm_control_panel entity is required');
    }
    this._config = config;
  }

  public getCardSize(): number {
    return 1;
  }

  private _featureColor(): string {
    const state = this._config ? this.hass?.states[this._config.entity]?.state : undefined;
    if (!state || state === 'unavailable') return 'var(--state-unavailable-color)';
    if (state === 'disarmed') {
      return 'var(--state-alarm_control_panel-disarmed-color, var(--state-alarm_control_panel-inactive-color, var(--state-inactive-color)))';
    }
    return `var(--state-alarm_control_panel-${state}-color, var(--state-alarm_control_panel-active-color, var(--state-active-color)))`;
  }

  protected updated(changedProps: PropertyValues): void {
    if (!changedProps.has('hass') && !changedProps.has('_config')) return;
    const feature = this.renderRoot.querySelector('ha_alarmo-card-feature') as AlarmoCardFeature | null;
    if (feature && this._config) {
      feature.setConfig({
        type: 'custom:ha_alarmo-card-feature',
        modes: this._config.modes,
        name: this._config.name,
      });
    }
  }

  private _renderFeature() {
    return html`
      <ha_alarmo-card-feature
        .hass=${this.hass}
        .context=${{ entity_id: this._config!.entity }}
        .position=${'bottom'}
      ></ha_alarmo-card-feature>
    `;
  }

  protected render() {
    if (!this.hass || !this._config) return nothing;
    const style = `--feature-color: ${this._featureColor()}`;
    return html`<ha-card class="container" style=${style}>${this._renderFeature()}</ha-card>`;
  }

  static styles = css`
    .container {
      --feature-border-radius: calc(var(--ha-card-border-radius, var(--ha-border-radius-xl, 12px)) - 6px);
      --feature-button-spacing: 2px;
      --control-select-button-spacing: var(--feature-button-spacing);
      --feature-height: 56px;
      padding: 4px;
    }
  `;
}

if (!customElements.get('ha_alarmo-tile-card')) {
  customElements.define('ha_alarmo-tile-card', AlarmoTileCard);
}

const customCards = ((window as any).customCards ||= []);
if (!customCards.some((card: { type?: string }) => card.type === 'ha_alarmo-tile-card')) {
  customCards.push({
    type: 'ha_alarmo-tile-card',
    name: 'HA Alarmo Tile Card',
    description: 'Standalone card containing only the Alarmo tile feature controls.',
  });
}

declare global {
  interface HTMLElementTagNameMap {
    'ha_alarmo-tile-card': AlarmoTileCard;
  }
}
