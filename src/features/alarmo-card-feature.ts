import { css, html, LitElement, nothing, PropertyValues, TemplateResult } from 'lit';

type UnsubscribeFunc = () => void;

type HassEntity = {
  entity_id: string;
  state: string;
  attributes: Record<string, any> & {
    supported_features?: number;
    open_sensors?: Record<string, string> | null;
    bypassed_sensors?: string[];
    delay?: number;
    code_format?: string | null;
    friendly_name?: string;
  };
};

type HomeAssistant = {
  language?: string;
  states: Record<string, HassEntity>;
  localize: (key: string, ...args: any[]) => string;
  callService: (domain: string, service: string, data?: Record<string, any>) => Promise<unknown>;
  callWS: <T>(message: Record<string, any>) => Promise<T>;
  formatEntityName?: (stateObj: HassEntity, name?: EntityNameConfig) => string | undefined;
  connection: {
    subscribeMessage: <T>(callback: (event: T) => void, message: Record<string, any>) => Promise<UnsubscribeFunc>;
  };
};

type AlarmoConfig = {
  code_arm_required: boolean;
  code_disarm_required: boolean;
  code_format: 'number' | 'text';
};

type AlarmoEvent = {
  data: {
    event: string;
    area_id: string | number;
    modes?: AlarmMode[];
    open_sensors?: Record<string, string>;
  };
};

type CountdownResponse = { delay: number; remaining: number };
type AlarmoEntityEntry = { area_id: string | number; entity_id: string };

type AlarmMode = 'armed_home' | 'armed_away' | 'armed_night' | 'armed_vacation' | 'armed_custom_bypass' | 'disarmed';

type EntityNameItem = string | { type: 'entity' | 'device' | 'area' | 'floor' } | { type: 'text'; text: string };

type EntityNameConfig = string | EntityNameItem | EntityNameItem[];

type AlarmoCardFeatureConfig = {
  type: 'custom:alarmo-card-feature';
  modes?: AlarmMode[];
  name?: EntityNameConfig;
};

type CardFeatureContext = {
  entity_id?: string;
};

type ControlSelectOption = {
  value: AlarmMode;
  label: string;
  icon: TemplateResult;
};

const ALARM_STATES = {
  disarmed: 'disarmed',
  arming: 'arming',
  pending: 'pending',
  triggered: 'triggered',
} as const;

const ALARMO_EVENTS = {
  arm: 'arm',
  disarm: 'disarm',
  trigger: 'trigger',
  failedToArm: 'failed_to_arm',
  commandNotAllowed: 'command_not_allowed',
  noCodeProvided: 'no_code_provided',
  invalidCodeProvided: 'invalid_code_provided',
  readyToArmModesChanged: 'ready_to_arm_modes_changed',
} as const;

const MODE_ICONS: Record<AlarmMode, string> = {
  armed_home: 'mdi:home',
  armed_away: 'mdi:lock',
  armed_night: 'mdi:moon-waning-crescent',
  armed_vacation: 'mdi:airplane',
  armed_custom_bypass: 'mdi:shield',
  disarmed: 'mdi:shield-off',
};

const MODE_FEATURES: Partial<Record<AlarmMode, number>> = {
  armed_home: 1,
  armed_away: 2,
  armed_night: 4,
  armed_custom_bypass: 16,
  armed_vacation: 32,
};

const CODE_BUTTONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'clear', 'submit'];

const NATIVE_MODE_ORDER: AlarmMode[] = [
  'armed_home',
  'armed_away',
  'armed_night',
  'armed_vacation',
  'armed_custom_bypass',
  'disarmed',
];

const isAlarmModesSupported = (hass: HomeAssistant, context: CardFeatureContext): boolean =>
  Boolean(context.entity_id?.startsWith('alarm_control_panel.') && hass.states[context.entity_id]);

export class AlarmoCardFeature extends LitElement {
  static properties = {
    hass: { attribute: false },
    context: { attribute: false },
    position: { attribute: false },
    _config: { state: true },
    _areaId: { state: true },
    _alarmoConfig: { state: true },
    _readyForArmModes: { state: true },
    _triggeredSensors: { state: true },
    _inline: { state: true },
    _codeDialog: { state: true },
    _code: { state: true },
    _codeError: { state: true },
    _busy: { state: true },
    _countdownRemaining: { state: true },
  };

  public hass?: HomeAssistant;

  public context?: CardFeatureContext;

  public position?: 'bottom' | 'inline';

  private _config?: AlarmoCardFeatureConfig;

  private _areaId?: string | number | null;

  private _alarmoConfig?: AlarmoConfig;

  private _readyForArmModes: AlarmMode[] | null = null;

  private _triggeredSensors: string[] = [];

  private _inline = false;

  private _codeDialog = false;

  private _code = '';

  private _codeError = false;

  private _busy = false;

  private _countdownRemaining?: number;

  private _countdownDuration = 0;

  private _countdownEnd = 0;

  private _countdownTimer?: number;

  private _countdownRequest = 0;

  private _commandTimer?: number;

  private _unsubscribe?: UnsubscribeFunc;

  private _subscriptionRequest = 0;

  private _loadedEntity?: string;

  private _pendingMode?: AlarmMode;

  public static getStubConfig(): AlarmoCardFeatureConfig {
    return { type: 'custom:alarmo-card-feature' };
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    const nativeFeature = customElements.get('hui-alarm-modes-card-feature') as {
      getConfigElement?: () => Promise<HTMLElement>;
    };
    if (!nativeFeature?.getConfigElement) {
      throw new Error('Native Home Assistant alarm-modes editor is not available');
    }
    return nativeFeature.getConfigElement();
  }

  public setConfig(config: AlarmoCardFeatureConfig): void {
    if (!config || config.type !== 'custom:alarmo-card-feature') {
      throw new Error('Invalid Alarmo card feature configuration');
    }
    this._config = config;
  }

  connectedCallback(): void {
    super.connectedCallback();
    void this._ensureSubscription();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._subscriptionRequest++;
    this._unsubscribe?.();
    this._unsubscribe = undefined;
    this._stopCountdown();
    this._clearCommandTimer();
  }

  protected firstUpdated(): void {
    requestAnimationFrame(() => this._syncPosition());
  }

  protected updated(changedProps: PropertyValues): void {
    if (changedProps.has('hass')) void this._ensureSubscription();
    const entityId = this.context?.entity_id;
    if (this.hass && entityId && entityId !== this._loadedEntity) {
      this._areaId = undefined;
      this._alarmoConfig = undefined;
      this._readyForArmModes = null;
      this._pendingMode = undefined;
      this._busy = false;
      this._stopCountdown();
      this._loadedEntity = entityId;
      void this._loadArea(entityId);
    }
    if (this.hass && entityId && changedProps.has('hass')) {
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
      const oldState = oldHass?.states[entityId];
      const newState = this.hass.states[entityId];
      const wasPending = oldState && this._isCountdownState(oldState.state);
      const isPending = newState && this._isCountdownState(newState.state);
      if (isPending && (!wasPending || oldState?.attributes.delay !== newState.attributes.delay)) {
        void this._startCountdown(entityId);
      } else if (!isPending && wasPending) {
        this._stopCountdown();
      }
    }
    if (changedProps.has('position')) requestAnimationFrame(() => this._syncPosition());
  }

  private _syncPosition(): void {
    const featureHeight = Number.parseFloat(getComputedStyle(this).getPropertyValue('--feature-height'));
    const inline = this.position === 'inline' || (Number.isFinite(featureHeight) && featureHeight < 40);
    if (inline !== this._inline) this._inline = inline;
  }

  private async _ensureSubscription(): Promise<void> {
    if (!this.isConnected || !this.hass || this._unsubscribe) return;
    const request = ++this._subscriptionRequest;
    try {
      const unsubscribe = await this.hass.connection.subscribeMessage<AlarmoEvent>(
        (event) => this._handleAlarmoEvent(event),
        { type: 'alarmo_updated' }
      );
      if (!this.isConnected || request !== this._subscriptionRequest) {
        unsubscribe();
        return;
      }
      this._unsubscribe = unsubscribe;
    } catch (_error) {
      // A later Home Assistant update will retry the subscription.
    }
  }

  private async _loadArea(entityId: string): Promise<void> {
    try {
      const [entities, ready, config] = await Promise.all([
        this.hass!.callWS<AlarmoEntityEntry[]>({ type: 'alarmo/entities' }),
        this.hass!.callWS<{ modes: AlarmMode[] | null }>({
          type: 'alarmo/ready_to_arm_modes',
          entity_id: entityId,
        }),
        this.hass!.callWS<AlarmoConfig>({ type: 'alarmo/config' }),
      ]);
      if (this._loadedEntity !== entityId) return;
      this._areaId = entities.find((entity) => entity.entity_id === entityId)?.area_id || null;
      this._readyForArmModes = ready.modes;
      this._alarmoConfig = config;
    } catch (_error) {
      if (this._loadedEntity !== entityId) return;
      this._areaId = undefined;
      this._alarmoConfig = undefined;
      this._readyForArmModes = null;
    }
  }

  private _isCountdownState(state?: string): boolean {
    return state === ALARM_STATES.arming || state === ALARM_STATES.pending;
  }

  private async _startCountdown(entityId: string): Promise<void> {
    this._stopCountdown();
    const request = ++this._countdownRequest;
    try {
      const countdown = await this.hass!.callWS<CountdownResponse>({
        type: 'alarmo/countdown',
        entity_id: entityId,
      });
      if (
        request !== this._countdownRequest ||
        !this.isConnected ||
        this._loadedEntity !== entityId ||
        !this._isCountdownState(this.hass?.states[entityId]?.state)
      ) {
        return;
      }
      this._countdownDuration = Math.max(Number(countdown.delay) || 0, 0);
      const remaining = Math.max(Number(countdown.remaining) || 0, 0);
      this._countdownEnd = Date.now() + remaining * 1000;
      this._updateCountdown();
      this._countdownTimer = window.setInterval(() => this._updateCountdown(), 250);
    } catch (_error) {
      if (request === this._countdownRequest) this._countdownRemaining = undefined;
    }
  }

  private _updateCountdown(): void {
    const remaining = Math.max((this._countdownEnd - Date.now()) / 1000, 0);
    this._countdownRemaining = remaining;
    if (remaining === 0 && this._countdownTimer !== undefined) {
      clearInterval(this._countdownTimer);
      this._countdownTimer = undefined;
    }
  }

  private _stopCountdown(): void {
    this._countdownRequest++;
    if (this._countdownTimer !== undefined) clearInterval(this._countdownTimer);
    this._countdownTimer = undefined;
    this._countdownDuration = 0;
    this._countdownEnd = 0;
    this._countdownRemaining = undefined;
  }

  private _clearCommandTimer(): void {
    if (this._commandTimer !== undefined) clearTimeout(this._commandTimer);
    this._commandTimer = undefined;
  }

  private _finishCommand(clearPending = true): void {
    this._clearCommandTimer();
    this._busy = false;
    if (clearPending) this._pendingMode = undefined;
  }

  private _startCommandTimer(): void {
    this._clearCommandTimer();
    this._commandTimer = window.setTimeout(() => this._finishCommand(), 10000);
  }

  private _handleAlarmoEvent(event: AlarmoEvent): void {
    if (event.data.area_id !== this._areaId) return;
    if (event.data.event === ALARMO_EVENTS.readyToArmModesChanged) {
      this._readyForArmModes = event.data.modes || null;
      return;
    }
    if (event.data.event === ALARMO_EVENTS.trigger) {
      this._triggeredSensors = Object.keys(event.data.open_sensors || {});
      return;
    }
    if ((event.data.event === ALARMO_EVENTS.arm || event.data.event === ALARMO_EVENTS.disarm) && this._busy) {
      this._finishCommand();
      this._triggeredSensors = [];
      this._codeDialog = false;
      this._code = '';
      this._codeError = false;
      return;
    }
    if (
      (event.data.event === ALARMO_EVENTS.invalidCodeProvided || event.data.event === ALARMO_EVENTS.noCodeProvided) &&
      this._busy &&
      this._pendingMode
    ) {
      this._finishCommand(false);
      this._code = '';
      this._codeError = true;
      this._codeDialog = true;
      return;
    }
    if (
      (event.data.event === ALARMO_EVENTS.failedToArm || event.data.event === ALARMO_EVENTS.commandNotAllowed) &&
      this._busy
    ) {
      this._finishCommand();
      this._codeDialog = false;
    }
  }

  private _alarmoMode(mode: AlarmMode): string {
    return mode === 'armed_custom_bypass' ? 'custom' : mode.replace('armed_', '');
  }

  private _requiresCode(mode: AlarmMode): boolean {
    if (!this._alarmoConfig) return Boolean(this.hass?.states[this.context?.entity_id || '']?.attributes.code_format);
    return mode === ALARM_STATES.disarmed
      ? this._alarmoConfig.code_disarm_required
      : this._alarmoConfig.code_arm_required;
  }

  private _valueChanged(event: CustomEvent<{ value: AlarmMode }>): void {
    const mode = event.detail.value;
    if (!mode || mode === this.hass?.states[this.context?.entity_id || '']?.state || this._busy) return;
    this._pendingMode = mode;
    this._code = '';
    this._codeError = false;
    if (this._requiresCode(mode)) {
      this._codeDialog = true;
      return;
    }
    void this._sendMode(mode, '');
  }

  private _disarm(): void {
    this._valueChanged(new CustomEvent('value-changed', { detail: { value: ALARM_STATES.disarmed as AlarmMode } }));
  }

  private async _sendMode(mode: AlarmMode, code: string): Promise<void> {
    const entityId = this.context?.entity_id;
    if (!this.hass || !entityId) return;
    this._busy = true;
    this._startCommandTimer();
    try {
      if (mode === ALARM_STATES.disarmed) {
        await this.hass.callService('alarmo', 'disarm', { entity_id: entityId, code });
      } else {
        await this.hass.callService('alarmo', 'arm', {
          entity_id: entityId,
          mode: this._alarmoMode(mode),
          code,
          force: true,
        });
      }
    } catch (_error) {
      this._finishCommand();
    }
  }

  private _submitCode(): void {
    if (!this._pendingMode || this._busy) return;
    this._codeError = false;
    void this._sendMode(this._pendingMode, this._code);
  }

  private _closeCodeDialog(): void {
    this._codeDialog = false;
    this._code = '';
    this._codeError = false;
    this._pendingMode = undefined;
  }

  private _codeInput(event: Event): void {
    this._code = (event.currentTarget as HTMLInputElement).value;
    this._codeError = false;
  }

  private _numberClick(event: MouseEvent): void {
    this._code += (event.currentTarget as HTMLElement & { value: string }).value;
    this._codeError = false;
  }

  private _renderCodeDialog() {
    if (!this._codeDialog || !this.hass || !this._pendingMode) return nothing;
    const disarm = this._pendingMode === ALARM_STATES.disarmed;
    const title = this.hass.localize(`ui.card.alarm_control_panel.${disarm ? 'disarm' : 'arm'}`);
    const textCode = this._alarmoConfig?.code_format === 'text';
    return html`
      <ha-adaptive-dialog open width="small" .headerTitle=${title} @closed=${this._closeCodeDialog}>
        <div class="code-container">
          <ha-input
            autofocus
            .value=${this._code}
            .label=${this.hass.localize('ui.dialogs.enter_code.input_label')}
            type="password"
            inputmode=${textCode ? 'text' : 'numeric'}
            .error=${this._codeError}
            .errorMessage=${
              this._codeError ? (this.hass.language?.startsWith('de') ? 'Ungültiger Code' : 'Invalid code') : ''
            }
            @input=${this._codeInput}
            @keydown=${(event: KeyboardEvent) => event.key === 'Enter' && this._submitCode()}
          ></ha-input>
          ${
            textCode
              ? nothing
              : html`
                  <div class="keypad">
                    ${CODE_BUTTONS.map((value) =>
                      value === 'clear'
                        ? html`
                            <ha-control-button
                              class="clear"
                              .disabled=${!this._code}
                              .label=${this.hass!.localize('ui.common.clear')}
                              @click=${() => {
                                this._code = '';
                                this._codeError = false;
                              }}
                            >
                              <ha-icon icon="mdi:close"></ha-icon>
                            </ha-control-button>
                          `
                        : value === 'submit'
                          ? html`
                              <ha-control-button class="submit" .label=${title} @click=${this._submitCode}>
                                <ha-icon icon="mdi:check"></ha-icon>
                              </ha-control-button>
                            `
                          : html`
                              <ha-control-button .value=${value} .label=${value} @click=${this._numberClick}>
                                ${value}
                              </ha-control-button>
                            `
                    )}
                  </div>
                `
          }
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button appearance="plain" slot="secondaryAction" @click=${this._closeCodeDialog}>
            ${this.hass.localize('ui.common.cancel')}
          </ha-button>
          <ha-button slot="primaryAction" .disabled=${this._busy} @click=${this._submitCode}>${title}</ha-button>
        </ha-dialog-footer>
      </ha-adaptive-dialog>
    `;
  }

  private _displayedModes(): AlarmMode[] {
    const entityId = this.context?.entity_id;
    const stateObj = entityId ? this.hass?.states[entityId] : undefined;
    if (!stateObj) return [];
    const supportedFeatures = Number(stateObj.attributes.supported_features) || 0;
    const supported = NATIVE_MODE_ORDER.filter(
      (mode) => mode === ALARM_STATES.disarmed || Boolean((MODE_FEATURES[mode] || 0) & supportedFeatures)
    ).reverse();
    return this._config?.modes ? this._config.modes.filter((mode) => supported.includes(mode)) : supported;
  }

  private _modeIcon(mode: AlarmMode): TemplateResult {
    const ready = this._readyForArmModes?.includes(mode);
    const activeMode = this.context?.entity_id ? this.hass?.states[this.context.entity_id]?.state === mode : false;
    const showReadiness = this._readyForArmModes !== null;
    const readinessTitle = ready
      ? this.hass!.language?.startsWith('de')
        ? 'Keine Sensoren werden umgangen'
        : 'No sensors will be bypassed'
      : this.hass!.language?.startsWith('de')
        ? 'Offene Sensoren werden umgangen'
        : 'Open sensors will be bypassed';
    return html`
      <span
        style=${`align-items: center; display: inline-flex; flex: 0 0 24px; height: 24px; justify-content: center; margin-block-end: ${
          this._inline ? '0' : '-4px'
        }; position: relative; width: 24px;`}
      >
        <ha-icon icon=${MODE_ICONS[mode]}></ha-icon>
        ${
          mode === ALARM_STATES.disarmed || activeMode || !showReadiness
            ? nothing
            : html`
                <span
                  title=${readinessTitle}
                  style=${`background: var(--${
                    ready ? 'green' : 'red'
                  }-color); border: 2px solid var(--card-background-color, white); border-radius: 50%; height: 7px; inset-inline-end: -3px; position: absolute; top: 0; width: 7px;`}
                ></span>
              `
        }
      </span>
    `;
  }

  private _triggeredSensorIds(): string[] {
    const entityId = this.context?.entity_id;
    const stateObj = entityId ? this.hass?.states[entityId] : undefined;
    if (stateObj?.state !== ALARM_STATES.triggered) return [];
    const stateSensors = Object.keys(stateObj.attributes.open_sensors || {});
    return this._triggeredSensors.length ? this._triggeredSensors : stateSensors;
  }

  private _bypassedSensorIds(): string[] {
    const entityId = this.context?.entity_id;
    const stateObj = entityId ? this.hass?.states[entityId] : undefined;
    if (!stateObj?.state.startsWith('armed_')) return [];
    return stateObj.attributes.bypassed_sensors || [];
  }

  private _showSensor(entityId: string): void {
    this.dispatchEvent(
      new CustomEvent('hass-more-info', {
        bubbles: true,
        composed: true,
        detail: { entityId },
      })
    );
  }

  private _renderSensorList(sensorIds: string[], type: 'triggered' | 'bypassed') {
    if (this._inline || !sensorIds.length || !this.hass) return nothing;
    const triggered = type === 'triggered';
    return html`
      <div class=${`sensor-list ${type}`}>
        <div class="sensor-heading">
          <ha-icon icon=${triggered ? 'mdi:alert' : 'mdi:shield-alert-outline'}></ha-icon>
          <span
            >${
              this.hass.language?.startsWith('de')
                ? triggered
                  ? 'Ausgelöst durch'
                  : 'Umgangene Sensoren'
                : triggered
                  ? 'Triggered by'
                  : 'Bypassed sensors'
            }</span
          >
        </div>
        ${sensorIds.map((entityId) => {
          const stateObj = this.hass!.states[entityId];
          return html`
            <button class="sensor-row" @click=${() => this._showSensor(entityId)}>
              <ha-state-icon .hass=${this.hass} .stateObj=${stateObj}></ha-state-icon>
              <span>${this._sensorName(stateObj, entityId)}</span>
            </button>
          `;
        })}
      </div>
    `;
  }

  private _sensorName(stateObj: HassEntity | undefined, entityId: string): string {
    if (!stateObj) return entityId;
    if (this._config?.name !== undefined && this.hass?.formatEntityName) {
      return this.hass.formatEntityName(stateObj, this._config.name) || entityId;
    }
    return stateObj.attributes.friendly_name || entityId;
  }

  protected render() {
    if (!this._config || !this.hass || !this.context || !isAlarmModesSupported(this.hass, this.context)) {
      return nothing;
    }

    const modes = this._displayedModes();
    const triggeredSensors = this._triggeredSensorIds();
    const bypassedSensors = this._bypassedSensorIds();
    const stateObj = this.hass.states[this.context.entity_id!];
    const activationPending = this._isCountdownState(stateObj.state);
    const pendingState = stateObj.state === ALARM_STATES.triggered || activationPending;
    const pendingLabel =
      stateObj.state === ALARM_STATES.pending
        ? this.hass.language?.startsWith('de')
          ? 'Auslösen'
          : 'Trigger'
        : this.hass.localize(
            `ui.card.alarm_control_panel.${stateObj.state === ALARM_STATES.arming ? 'arm' : 'disarm'}`
          );
    const pendingColor = stateObj.state === ALARM_STATES.arming ? 'var(--green-color)' : 'var(--red-color)';
    const pendingIcon =
      stateObj.state === ALARM_STATES.arming
        ? 'mdi:shield-lock-outline'
        : stateObj.state === ALARM_STATES.pending
          ? 'mdi:alarm-light-outline'
          : 'mdi:alarm-light';
    const options: ControlSelectOption[] = modes.map((mode) => ({
      value: mode,
      label:
        mode === ALARM_STATES.disarmed && stateObj.state !== ALARM_STATES.disarmed
          ? this.hass!.localize('ui.card.alarm_control_panel.disarm')
          : this.hass!.localize(`ui.card.alarm_control_panel.modes.${mode}`),
      icon: this._modeIcon(mode),
    }));
    const selectionPending = Boolean(this._pendingMode && this._pendingMode !== stateObj.state);
    const showCountdown = activationPending && this._countdownRemaining !== undefined;
    const countdownProgress =
      showCountdown && this._countdownDuration
        ? Math.min(Math.max(1 - this._countdownRemaining! / this._countdownDuration, 0), 1)
        : 0;

    return html`
      <div class=${`feature-wrapper ${this._inline ? 'inline' : 'bottom'}`}>
        ${
          pendingState
            ? html`
                <button
                  class="pending-control"
                  style=${`--countdown-progress: ${countdownProgress * 100}%; --pending-color: ${pendingColor}`}
                  ?disabled=${this._busy}
                  @click=${this._disarm}
                >
                  <span class="countdown-fill"></span>
                  <span class="pending-content">
                    <ha-icon .icon=${pendingIcon}></ha-icon>
                    <span>${pendingLabel}</span>
                    ${showCountdown ? html`<span class="countdown-value">${Math.ceil(this._countdownRemaining!)} s</span>` : nothing}
                  </span>
                </button>
              `
            : html`
                <ha-control-select
                  .options=${options}
                  .value=${
                    !selectionPending && modes.includes(stateObj.state as AlarmMode) ? stateObj.state : undefined
                  }
                  .label=${this.hass.localize('ui.card.alarm_control_panel.modes_label')}
                  .disabled=${stateObj.state === 'unavailable' || this._busy}
                  ?hide-option-label=${this._inline}
                  @value-changed=${this._valueChanged}
                ></ha-control-select>
              `
        }
      </div>
      ${this._renderSensorList(triggeredSensors, 'triggered')} ${this._renderSensorList(bypassedSensors, 'bypassed')}
      ${this._renderCodeDialog()}
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    .feature-wrapper {
      position: relative;
    }
    .feature-wrapper.bottom ha-control-select {
      --control-select-thickness: 56px;
    }
    ha-control-select {
      --control-select-background-opacity: 0;
      --control-select-color: var(--feature-color);
      --control-select-padding: 0;
      --control-select-thickness: var(--feature-height);
      --control-select-border-radius: var(--feature-border-radius);
      --control-select-button-border-radius: var(--feature-border-radius);
    }
    .pending-control {
      align-items: stretch;
      background: var(--control-button-background-color, var(--secondary-background-color));
      border: 0;
      border-radius: var(--feature-border-radius);
      color: var(--primary-text-color);
      cursor: pointer;
      display: grid;
      font: inherit;
      height: var(--feature-height);
      overflow: hidden;
      padding: 0;
      position: relative;
      width: 100%;
    }
    .feature-wrapper.bottom .pending-control {
      height: 56px;
    }
    .pending-control:disabled {
      cursor: default;
      opacity: 0.5;
    }
    .pending-control:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .countdown-fill {
      background: color-mix(in srgb, var(--pending-color) 24%, transparent);
      bottom: 0;
      inset-inline-start: 0;
      pointer-events: none;
      position: absolute;
      top: 0;
      transition: width 250ms linear;
      width: var(--countdown-progress, 0%);
    }
    .pending-content {
      align-items: center;
      color: var(--pending-color);
      display: flex;
      gap: 8px;
      justify-content: center;
      min-width: 0;
      padding: 0 12px;
      position: relative;
      z-index: 1;
    }
    .pending-content ha-icon {
      color: var(--pending-color);
    }
    .countdown-value {
      font-variant-numeric: tabular-nums;
      min-width: 3.5ch;
    }
    .feature-wrapper.inline .pending-content > span {
      display: none;
    }
    .code-container {
      align-items: center;
      display: flex;
      flex-direction: column;
    }
    .code-container ha-input {
      width: 100%;
    }
    .keypad {
      direction: ltr;
      display: grid;
      gap: var(--ha-space-6, 24px);
      grid-template-columns: repeat(3, auto);
      justify-items: center;
      margin-top: 12px;
      padding: 12px;
    }
    .keypad ha-control-button {
      font-size: var(--ha-font-size-2xl, 24px);
      height: 56px;
      width: 56px;
      --control-button-border-radius: var(--ha-border-radius-4xl, 28px);
    }
    .submit {
      --control-button-background-color: var(--green-color);
      --control-button-icon-color: var(--green-color);
    }
    .clear {
      --control-button-background-color: var(--red-color);
      --control-button-icon-color: var(--red-color);
    }
    .sensor-list {
      border-radius: var(--feature-border-radius);
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 4px;
      padding: 10px;
    }
    .sensor-list.triggered {
      background: var(--ha-color-fill-danger-quiet, rgba(219, 68, 55, 0.08));
    }
    .sensor-list.bypassed {
      background: var(--ha-color-fill-warning-quiet, rgba(255, 152, 0, 0.1));
    }
    .sensor-heading {
      align-items: center;
      display: flex;
      font-weight: 500;
      gap: 8px;
    }
    .sensor-list.triggered .sensor-heading {
      color: var(--error-color, var(--red-color));
    }
    .sensor-list.bypassed .sensor-heading {
      color: var(--warning-color, var(--orange-color));
    }
    .sensor-list.bypassed .sensor-heading ha-icon,
    .sensor-list.bypassed .sensor-row ha-state-icon {
      color: var(--warning-color, var(--orange-color));
      --state-icon-color: var(--warning-color, var(--orange-color));
    }
    .sensor-row {
      align-items: center;
      background: transparent;
      border: 0;
      color: var(--primary-text-color);
      cursor: pointer;
      display: grid;
      font: inherit;
      gap: 10px;
      grid-template-columns: 28px 1fr;
      padding: 6px;
      padding-inline-start: 32px;
      text-align: start;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'alarmo-card-feature': AlarmoCardFeature;
  }
}

if (!customElements.get('alarmo-card-feature')) {
  customElements.define('alarmo-card-feature', AlarmoCardFeature);
}

const customCardFeatures = ((window as any).customCardFeatures ||= []);
if (!customCardFeatures.some((feature: { type?: string }) => feature.type === 'alarmo-card-feature')) {
  customCardFeatures.push({
    type: 'alarmo-card-feature',
    name: 'Alarmo controls',
    configurable: true,
    isSupported: isAlarmModesSupported,
  });
}
