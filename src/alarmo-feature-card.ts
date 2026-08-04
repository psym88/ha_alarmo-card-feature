import { css, html, LitElement, nothing, PropertyValues } from 'lit';
import { AlarmoCardFeature } from './features/alarmo-card-feature';

type AlarmMode = 'armed_home' | 'armed_away' | 'armed_night' | 'armed_vacation' | 'armed_custom_bypass' | 'disarmed';

type AlarmoFeatureCardConfig = {
  type: 'custom:alarmo-feature-card';
  entity: string;
  modes?: AlarmMode[];
};

type HomeAssistant = {
  states: Record<string, { entity_id: string }>;
};

export class AlarmoFeatureCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  public hass?: HomeAssistant;

  private _config?: AlarmoFeatureCardConfig;

  public static getStubConfig(hass: HomeAssistant): AlarmoFeatureCardConfig {
    return {
      type: 'custom:alarmo-feature-card',
      entity: Object.keys(hass.states).find((entityId) => entityId.startsWith('alarm_control_panel.')) || '',
    };
  }

  public setConfig(config: AlarmoFeatureCardConfig): void {
    if (!config?.entity?.startsWith('alarm_control_panel.')) {
      throw new Error('An alarm_control_panel entity is required');
    }
    this._config = config;
  }

  public getCardSize(): number {
    return 1;
  }

  protected updated(changedProps: PropertyValues): void {
    if (!changedProps.has('hass') && !changedProps.has('_config')) return;
    const feature = this.renderRoot.querySelector('alarmo-card-feature') as AlarmoCardFeature | null;
    if (feature && this._config) {
      feature.setConfig({
        type: 'custom:alarmo-card-feature',
        modes: this._config.modes,
      });
    }
  }

  protected render() {
    if (!this.hass || !this._config) return nothing;
    return html`
      <ha-card>
        <alarmo-card-feature
          .hass=${this.hass}
          .context=${{ entity_id: this._config.entity }}
          .position=${'bottom'}
        ></alarmo-card-feature>
      </ha-card>
    `;
  }

  static styles = css`
    ha-card {
      padding: var(--ha-card-feature-gap, 12px);
      --feature-border-radius: var(--ha-border-radius-xl, 12px);
      --feature-button-spacing: 8px;
      --feature-color: var(--primary-color);
      --feature-height: 56px;
    }
  `;
}

if (!customElements.get('alarmo-feature-card')) {
  customElements.define('alarmo-feature-card', AlarmoFeatureCard);
}

const customCards = ((window as any).customCards ||= []);
if (!customCards.some((card: { type?: string }) => card.type === 'alarmo-feature-card')) {
  customCards.push({
    type: 'alarmo-feature-card',
    name: 'Alarmo Feature Card',
    description: 'Standalone card containing only the Alarmo tile feature controls.',
  });
}

declare global {
  interface HTMLElementTagNameMap {
    'alarmo-feature-card': AlarmoFeatureCard;
  }
}
