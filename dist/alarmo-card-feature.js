const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new o(i,t,s)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:d,getOwnPropertyDescriptor:h,getOwnPropertyNames:c,getOwnPropertySymbols:l,getPrototypeOf:u}=Object,p=globalThis,_=p.trustedTypes,m=_?_.emptyScript:"",g=p.reactiveElementPolyfillSupport,f=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},y=(t,e)=>!a(t,e),b={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let v=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&d(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const n=i?.call(this);o?.call(this,e),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...c(t),...l(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),o=t.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:$).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=i;const n=o.fromAttribute(e,t.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const n=this.constructor;if(!1===i&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??y)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[f("elementProperties")]=new Map,v[f("finalized")]=new Map,g?.({ReactiveElement:v}),(p.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,A=t=>t,C=w.trustedTypes,E=C?C.createPolicy("lit-html",{createHTML:t=>t}):void 0,x="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+S,k=`<${M}>`,T=document,P=()=>T.createComment(""),R=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,O="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,H=/>/g,I=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),z=/'/g,q=/"/g,j=/^(?:script|style|textarea|title)$/i,W=(t,...e)=>({_$litType$:1,strings:t,values:e}),B=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),L=new WeakMap,V=T.createTreeWalker(T,129);function K(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const J=(t,e)=>{const s=t.length-1,i=[];let o,n=2===e?"<svg>":3===e?"<math>":"",r=N;for(let e=0;e<s;e++){const s=t[e];let a,d,h=-1,c=0;for(;c<s.length&&(r.lastIndex=c,d=r.exec(s),null!==d);)c=r.lastIndex,r===N?"!--"===d[1]?r=D:void 0!==d[1]?r=H:void 0!==d[2]?(j.test(d[2])&&(o=RegExp("</"+d[2],"g")),r=I):void 0!==d[3]&&(r=I):r===I?">"===d[0]?(r=o??N,h=-1):void 0===d[1]?h=-2:(h=r.lastIndex-d[2].length,a=d[1],r=void 0===d[3]?I:'"'===d[3]?q:z):r===q||r===z?r=I:r===D||r===H?r=N:(r=I,o=void 0);const l=r===I&&t[e+1].startsWith("/>")?" ":"";n+=r===N?s+k:h>=0?(i.push(a),s.slice(0,h)+x+s.slice(h)+S+l):s+S+(-2===h?e:l)}return[K(t,n+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Z{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[d,h]=J(t,e);if(this.el=Z.createElement(d,s),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=V.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(x)){const e=h[n++],s=i.getAttribute(t).split(S),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:s,ctor:"."===r[1]?tt:"?"===r[1]?et:"@"===r[1]?st:Y}),i.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(j.test(i.tagName)){const t=i.textContent.split(S),e=t.length-1;if(e>0){i.textContent=C?C.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],P()),V.nextNode(),a.push({type:2,index:++o});i.append(t[e],P())}}}else if(8===i.nodeType)if(i.data===M)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(S,t+1));)a.push({type:7,index:o}),t+=S.length-1}o++}}static createElement(t,e){const s=T.createElement("template");return s.innerHTML=t,s}}function G(t,e,s=t,i){if(e===B)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const n=R(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=G(t,o._$AS(t,e.values),o,i)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??T).importNode(e,!0);V.currentNode=i;let o=V.nextNode(),n=0,r=0,a=s[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new X(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new it(o,this,t)),this._$AV.push(e),a=s[++r]}n!==a?.index&&(o=V.nextNode(),n++)}return V.currentNode=T,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),R(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==F&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Z.createElement(K(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Q(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=L.get(t.strings);return void 0===e&&L.set(t.strings,e=new Z(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new X(this.O(P()),this.O(P()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=F}_$AI(t,e=this,s,i){const o=this.strings;let n=!1;if(void 0===o)t=G(this,t,e,0),n=!R(t)||t!==this._$AH&&t!==B,n&&(this._$AH=t);else{const i=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=G(this,i[s+r],e,r),a===B&&(a=this._$AH[r]),n||=!R(a)||a!==this._$AH[r],a===F?t=F:t!==F&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!i&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class st extends Y{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??F)===B)return;const s=this._$AH,i=t===F&&s!==F||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==F&&(s===F||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const ot=w.litHtmlPolyfillSupport;ot?.(Z,X),(w.litHtmlVersions??=[]).push("3.3.3");const nt=globalThis;class rt extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new X(e.insertBefore(P(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}rt._$litElement$=!0,rt.finalized=!0,nt.litElementHydrateSupport?.({LitElement:rt});const at=nt.litElementPolyfillSupport;at?.({LitElement:rt}),(nt.litElementVersions??=[]).push("4.2.2");const dt="disarmed",ht="arming",ct="pending",lt="triggered",ut={armed_home:"mdi:home",armed_away:"mdi:lock",armed_night:"mdi:moon-waning-crescent",armed_vacation:"mdi:airplane",armed_custom_bypass:"mdi:shield",disarmed:"mdi:shield-off"},pt={armed_home:1,armed_away:2,armed_night:4,armed_custom_bypass:16,armed_vacation:32},_t=["1","2","3","4","5","6","7","8","9","0","clear","submit"],mt=["armed_home","armed_away","armed_night","armed_vacation","armed_custom_bypass","disarmed"],gt=(t,e)=>Boolean(e.entity_id?.startsWith("alarm_control_panel.")&&t.states[e.entity_id]);class ft extends rt{constructor(){super(...arguments),this._readyForArmModes=null,this._triggeredSensors=[],this._inline=!1,this._codeDialog=!1,this._code="",this._codeError=!1,this._busy=!1,this._countdownDuration=0,this._countdownEnd=0,this._countdownRequest=0,this._subscriptionRequest=0}static{this.properties={hass:{attribute:!1},context:{attribute:!1},position:{attribute:!1},_config:{state:!0},_areaId:{state:!0},_alarmoConfig:{state:!0},_readyForArmModes:{state:!0},_triggeredSensors:{state:!0},_inline:{state:!0},_codeDialog:{state:!0},_code:{state:!0},_codeError:{state:!0},_busy:{state:!0},_countdownRemaining:{state:!0}}}static getStubConfig(){return{type:"custom:alarmo-card-feature"}}static async getConfigElement(){const t=customElements.get("hui-alarm-modes-card-feature");if(!t?.getConfigElement)throw new Error("Native Home Assistant alarm-modes editor is not available");return t.getConfigElement()}setConfig(t){if(!t||"custom:alarmo-card-feature"!==t.type)throw new Error("Invalid Alarmo card feature configuration");this._config=t}connectedCallback(){super.connectedCallback(),this._ensureSubscription()}disconnectedCallback(){super.disconnectedCallback(),this._subscriptionRequest++,this._unsubscribe?.(),this._unsubscribe=void 0,this._stopCountdown(),this._clearCommandTimer()}firstUpdated(){requestAnimationFrame(()=>this._syncPosition())}updated(t){t.has("hass")&&this._ensureSubscription();const e=this.context?.entity_id;if(this.hass&&e&&e!==this._loadedEntity&&(this._areaId=void 0,this._alarmoConfig=void 0,this._readyForArmModes=null,this._pendingMode=void 0,this._busy=!1,this._stopCountdown(),this._loadedEntity=e,this._loadArea(e)),this.hass&&e&&t.has("hass")){const s=t.get("hass"),i=s?.states[e],o=this.hass.states[e],n=i&&this._isCountdownState(i.state),r=o&&this._isCountdownState(o.state);!r||n&&i?.attributes.delay===o.attributes.delay?!r&&n&&this._stopCountdown():this._startCountdown(e)}t.has("position")&&requestAnimationFrame(()=>this._syncPosition())}_syncPosition(){const t=Number.parseFloat(getComputedStyle(this).getPropertyValue("--feature-height")),e="inline"===this.position||Number.isFinite(t)&&t<40;e!==this._inline&&(this._inline=e)}async _ensureSubscription(){if(!this.isConnected||!this.hass||this._unsubscribe)return;const t=++this._subscriptionRequest;try{const e=await this.hass.connection.subscribeMessage(t=>this._handleAlarmoEvent(t),{type:"alarmo_updated"});if(!this.isConnected||t!==this._subscriptionRequest)return void e();this._unsubscribe=e}catch(t){}}async _loadArea(t){try{const[e,s,i]=await Promise.all([this.hass.callWS({type:"alarmo/entities"}),this.hass.callWS({type:"alarmo/ready_to_arm_modes",entity_id:t}),this.hass.callWS({type:"alarmo/config"})]);if(this._loadedEntity!==t)return;this._areaId=e.find(e=>e.entity_id===t)?.area_id||null,this._readyForArmModes=s.modes,this._alarmoConfig=i}catch(e){if(this._loadedEntity!==t)return;this._areaId=void 0,this._alarmoConfig=void 0,this._readyForArmModes=null}}_isCountdownState(t){return t===ht||t===ct}async _startCountdown(t){this._stopCountdown();const e=++this._countdownRequest;try{const s=await this.hass.callWS({type:"alarmo/countdown",entity_id:t});if(e!==this._countdownRequest||!this.isConnected||this._loadedEntity!==t||!this._isCountdownState(this.hass?.states[t]?.state))return;this._countdownDuration=Math.max(Number(s.delay)||0,0);const i=Math.max(Number(s.remaining)||0,0);this._countdownEnd=Date.now()+1e3*i,this._updateCountdown(),this._countdownTimer=window.setInterval(()=>this._updateCountdown(),250)}catch(t){e===this._countdownRequest&&(this._countdownRemaining=void 0)}}_updateCountdown(){const t=Math.max((this._countdownEnd-Date.now())/1e3,0);this._countdownRemaining=t,0===t&&void 0!==this._countdownTimer&&(clearInterval(this._countdownTimer),this._countdownTimer=void 0)}_stopCountdown(){this._countdownRequest++,void 0!==this._countdownTimer&&clearInterval(this._countdownTimer),this._countdownTimer=void 0,this._countdownDuration=0,this._countdownEnd=0,this._countdownRemaining=void 0}_clearCommandTimer(){void 0!==this._commandTimer&&clearTimeout(this._commandTimer),this._commandTimer=void 0}_finishCommand(t=!0){this._clearCommandTimer(),this._busy=!1,t&&(this._pendingMode=void 0)}_startCommandTimer(){this._clearCommandTimer(),this._commandTimer=window.setTimeout(()=>this._finishCommand(),1e4)}_handleAlarmoEvent(t){if(t.data.area_id===this._areaId)if("ready_to_arm_modes_changed"!==t.data.event){if("trigger"!==t.data.event)return"arm"!==t.data.event&&"disarm"!==t.data.event||!this._busy?("invalid_code_provided"===t.data.event||"no_code_provided"===t.data.event)&&this._busy&&this._pendingMode?(this._finishCommand(!1),this._code="",this._codeError=!0,void(this._codeDialog=!0)):void("failed_to_arm"!==t.data.event&&"command_not_allowed"!==t.data.event||!this._busy||(this._finishCommand(),this._codeDialog=!1)):(this._finishCommand(),this._triggeredSensors=[],this._codeDialog=!1,this._code="",void(this._codeError=!1));this._triggeredSensors=Object.keys(t.data.open_sensors||{})}else this._readyForArmModes=t.data.modes||null}_alarmoMode(t){return"armed_custom_bypass"===t?"custom":t.replace("armed_","")}_requiresCode(t){return this._alarmoConfig?t===dt?this._alarmoConfig.code_disarm_required:this._alarmoConfig.code_arm_required:Boolean(this.hass?.states[this.context?.entity_id||""]?.attributes.code_format)}_valueChanged(t){const e=t.detail.value;e&&e!==this.hass?.states[this.context?.entity_id||""]?.state&&!this._busy&&(this._pendingMode=e,this._code="",this._codeError=!1,this._requiresCode(e)?this._codeDialog=!0:this._sendMode(e,""))}_disarm(){this._valueChanged(new CustomEvent("value-changed",{detail:{value:dt}}))}async _sendMode(t,e){const s=this.context?.entity_id;if(this.hass&&s){this._busy=!0,this._startCommandTimer();try{t===dt?await this.hass.callService("alarmo","disarm",{entity_id:s,code:e}):await this.hass.callService("alarmo","arm",{entity_id:s,mode:this._alarmoMode(t),code:e,force:!0})}catch(t){this._finishCommand()}}}_submitCode(){this._pendingMode&&!this._busy&&(this._codeError=!1,this._sendMode(this._pendingMode,this._code))}_closeCodeDialog(){this._codeDialog=!1,this._code="",this._codeError=!1,this._pendingMode=void 0}_codeInput(t){this._code=t.currentTarget.value,this._codeError=!1}_numberClick(t){this._code+=t.currentTarget.value,this._codeError=!1}_renderCodeDialog(){if(!this._codeDialog||!this.hass||!this._pendingMode)return F;const t=this._pendingMode===dt,e=this.hass.localize("ui.card.alarm_control_panel."+(t?"disarm":"arm")),s="text"===this._alarmoConfig?.code_format;return W`
      <ha-adaptive-dialog open width="small" .headerTitle=${e} @closed=${this._closeCodeDialog}>
        <div class="code-container">
          <ha-input
            autofocus
            .value=${this._code}
            .label=${this.hass.localize("ui.dialogs.enter_code.input_label")}
            type="password"
            inputmode=${s?"text":"numeric"}
            .error=${this._codeError}
            .errorMessage=${this._codeError?this.hass.language?.startsWith("de")?"Ungültiger Code":"Invalid code":""}
            @input=${this._codeInput}
            @keydown=${t=>"Enter"===t.key&&this._submitCode()}
          ></ha-input>
          ${s?F:W`
                  <div class="keypad">
                    ${_t.map(t=>"clear"===t?W`
                            <ha-control-button
                              class="clear"
                              .disabled=${!this._code}
                              .label=${this.hass.localize("ui.common.clear")}
                              @click=${()=>{this._code="",this._codeError=!1}}
                            >
                              <ha-icon icon="mdi:close"></ha-icon>
                            </ha-control-button>
                          `:"submit"===t?W`
                              <ha-control-button class="submit" .label=${e} @click=${this._submitCode}>
                                <ha-icon icon="mdi:check"></ha-icon>
                              </ha-control-button>
                            `:W`
                              <ha-control-button .value=${t} .label=${t} @click=${this._numberClick}>
                                ${t}
                              </ha-control-button>
                            `)}
                  </div>
                `}
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button appearance="plain" slot="secondaryAction" @click=${this._closeCodeDialog}>
            ${this.hass.localize("ui.common.cancel")}
          </ha-button>
          <ha-button slot="primaryAction" .disabled=${this._busy} @click=${this._submitCode}>${e}</ha-button>
        </ha-dialog-footer>
      </ha-adaptive-dialog>
    `}_displayedModes(){const t=this.context?.entity_id,e=t?this.hass?.states[t]:void 0;if(!e)return[];const s=Number(e.attributes.supported_features)||0,i=mt.filter(t=>t===dt||Boolean((pt[t]||0)&s)).reverse();return this._config?.modes?this._config.modes.filter(t=>i.includes(t)):i}_modeIcon(t){const e=this._readyForArmModes?.includes(t),s=!!this.context?.entity_id&&this.hass?.states[this.context.entity_id]?.state===t,i=null!==this._readyForArmModes,o=e?this.hass.language?.startsWith("de")?"Keine Sensoren werden umgangen":"No sensors will be bypassed":this.hass.language?.startsWith("de")?"Offene Sensoren werden umgangen":"Open sensors will be bypassed";return W`
      <span
        style=${`align-items: center; display: inline-flex; flex: 0 0 24px; height: 24px; justify-content: center; margin-block-end: ${this._inline?"0":"-4px"}; position: relative; width: 24px;`}
      >
        <ha-icon icon=${ut[t]}></ha-icon>
        ${t===dt||s||!i?F:W`
                <span
                  title=${o}
                  style=${`background: var(--${e?"green":"red"}-color); border: 2px solid var(--card-background-color, white); border-radius: 50%; height: 7px; inset-inline-end: -3px; position: absolute; top: 0; width: 7px;`}
                ></span>
              `}
      </span>
    `}_triggeredSensorIds(){const t=this.context?.entity_id,e=t?this.hass?.states[t]:void 0;if(e?.state!==lt)return[];const s=Object.keys(e.attributes.open_sensors||{});return this._triggeredSensors.length?this._triggeredSensors:s}_bypassedSensorIds(){const t=this.context?.entity_id,e=t?this.hass?.states[t]:void 0;return e?.state.startsWith("armed_")&&e.attributes.bypassed_sensors||[]}_showSensor(t){this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:t}}))}_renderTriggeredSensors(t){return!this._inline&&t.length&&this.hass?W`
      <div class="triggered-sensors">
        <div class="triggered-heading">
          <ha-icon icon="mdi:alert"></ha-icon>
          <span>${this.hass.language?.startsWith("de")?"Ausgelöst durch":"Triggered by"}</span>
        </div>
        ${t.map(t=>{const e=this.hass.states[t];return W`
            <button class="triggered-sensor" @click=${()=>this._showSensor(t)}>
              <ha-state-icon .hass=${this.hass} .stateObj=${e}></ha-state-icon>
              <span>${this._triggeredSensorName(e,t)}</span>
            </button>
          `})}
      </div>
    `:F}_triggeredSensorName(t,e){return t?void 0!==this._config?.name&&this.hass?.formatEntityName?this.hass.formatEntityName(t,this._config.name)||e:t.attributes.friendly_name||e:e}_renderBypassedSensors(t){return!this._inline&&t.length&&this.hass?W`
      <div class="bypassed-sensors">
        <div class="bypassed-heading">
          <ha-icon icon="mdi:shield-alert-outline"></ha-icon>
          <span>${this.hass.language?.startsWith("de")?"Umgangene Sensoren":"Bypassed sensors"}</span>
        </div>
        ${t.map(t=>{const e=this.hass.states[t];return W`
            <button class="bypassed-sensor" @click=${()=>this._showSensor(t)}>
              <ha-state-icon .hass=${this.hass} .stateObj=${e}></ha-state-icon>
              <span>${e?.attributes.friendly_name||t}</span>
            </button>
          `})}
      </div>
    `:F}render(){if(!(this._config&&this.hass&&this.context&&gt(this.hass,this.context)))return F;const t=this._displayedModes(),e=this._triggeredSensorIds(),s=this._bypassedSensorIds(),i=this.hass.states[this.context.entity_id],o=this._isCountdownState(i.state),n=i.state===lt||o,r=i.state===ct?this.hass.language?.startsWith("de")?"Auslösen":"Trigger":this.hass.localize("ui.card.alarm_control_panel."+(i.state===ht?"arm":"disarm")),a=i.state===ht?"var(--green-color)":"var(--red-color)",d=i.state===ht?"mdi:shield-lock-outline":i.state===ct?"mdi:alarm-light-outline":"mdi:alarm-light",h=t.map(t=>({value:t,label:t===dt&&i.state!==dt?this.hass.localize("ui.card.alarm_control_panel.disarm"):this.hass.localize(`ui.card.alarm_control_panel.modes.${t}`),icon:this._modeIcon(t)})),c=Boolean(this._pendingMode&&this._pendingMode!==i.state),l=o&&void 0!==this._countdownRemaining,u=l&&this._countdownDuration?Math.min(Math.max(1-this._countdownRemaining/this._countdownDuration,0),1):0;return W`
      <div class=${"feature-wrapper "+(this._inline?"inline":"bottom")}>
        ${n?W`
                <button
                  class="pending-control"
                  style=${`--countdown-progress: ${100*u}%; --pending-color: ${a}`}
                  ?disabled=${this._busy}
                  @click=${this._disarm}
                >
                  <span class="countdown-fill"></span>
                  <span class="pending-content">
                    <ha-icon .icon=${d}></ha-icon>
                    <span>${r}</span>
                    ${l?W`<span class="countdown-value">${Math.ceil(this._countdownRemaining)} s</span>`:F}
                  </span>
                </button>
              `:W`
                <ha-control-select
                  .options=${h}
                  .value=${!c&&t.includes(i.state)?i.state:void 0}
                  .label=${this.hass.localize("ui.card.alarm_control_panel.modes_label")}
                  .disabled=${"unavailable"===i.state||this._busy}
                  ?hide-option-label=${this._inline}
                  @value-changed=${this._valueChanged}
                ></ha-control-select>
              `}
      </div>
      ${this._renderTriggeredSensors(e)} ${this._renderBypassedSensors(s)}
      ${this._renderCodeDialog()}
    `}static{this.styles=n`
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
    .triggered-sensors {
      background: var(--ha-color-fill-danger-quiet, rgba(219, 68, 55, 0.08));
      border-radius: var(--feature-border-radius);
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 6px;
      padding: 10px;
    }
    .bypassed-sensors {
      background: var(--ha-color-fill-warning-quiet, rgba(255, 152, 0, 0.1));
      border-radius: var(--feature-border-radius);
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 6px;
      padding: 10px;
    }
    .triggered-heading {
      align-items: center;
      color: var(--error-color, var(--red-color));
      display: flex;
      font-weight: 500;
      gap: 8px;
    }
    .bypassed-heading {
      align-items: center;
      color: var(--warning-color, var(--orange-color));
      display: flex;
      font-weight: 500;
      gap: 8px;
    }
    .bypassed-heading ha-icon,
    .bypassed-sensor ha-state-icon {
      color: var(--warning-color, var(--orange-color));
      --state-icon-color: var(--warning-color, var(--orange-color));
    }
    .triggered-sensor {
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
      text-align: start;
    }
    .bypassed-sensor {
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
      text-align: start;
    }
  `}}customElements.get("alarmo-card-feature")||customElements.define("alarmo-card-feature",ft);const $t=window.customCardFeatures||=[];$t.some(t=>"alarmo-card-feature"===t.type)||$t.push({type:"alarmo-card-feature",name:"Alarmo controls",configurable:!0,isSupported:gt});class yt extends rt{static{this.properties={hass:{attribute:!1},_config:{state:!0}}}static getStubConfig(t){return{type:"custom:alarmo-tile-card",entity:Object.keys(t.states).find(t=>t.startsWith("alarm_control_panel."))||""}}setConfig(t){if(!t?.entity?.startsWith("alarm_control_panel."))throw new Error("An alarm_control_panel entity is required");this._config=t}getCardSize(){return 1}_featureColor(){const t=this._config?this.hass?.states[this._config.entity]?.state:void 0;return t&&"unavailable"!==t?"disarmed"===t?"var(--state-alarm_control_panel-disarmed-color, var(--state-alarm_control_panel-inactive-color, var(--state-inactive-color)))":`var(--state-alarm_control_panel-${t}-color, var(--state-alarm_control_panel-active-color, var(--state-active-color)))`:"var(--state-unavailable-color)"}updated(t){if(!t.has("hass")&&!t.has("_config"))return;const e=this.renderRoot.querySelector("alarmo-card-feature");e&&this._config&&e.setConfig({type:"custom:alarmo-card-feature",modes:this._config.modes,name:this._config.name})}_renderFeature(){return W`
      <alarmo-card-feature
        .hass=${this.hass}
        .context=${{entity_id:this._config.entity}}
        .position=${"bottom"}
      ></alarmo-card-feature>
    `}render(){if(!this.hass||!this._config)return F;const t=`--feature-color: ${this._featureColor()}`;return W`<ha-card class="container" style=${t}>${this._renderFeature()}</ha-card>`}static{this.styles=n`
    .container {
      --feature-border-radius: calc(var(--ha-card-border-radius, var(--ha-border-radius-xl, 12px)) - 6px);
      --feature-button-spacing: 2px;
      --control-select-button-spacing: var(--feature-button-spacing);
      --feature-height: 56px;
      padding: 4px;
    }
  `}}customElements.get("alarmo-tile-card")||customElements.define("alarmo-tile-card",yt);const bt=window.customCards||=[];bt.some(t=>"alarmo-tile-card"===t.type)||bt.push({type:"alarmo-tile-card",name:"Alarmo Tile Card",description:"Standalone card containing only the Alarmo tile feature controls."});
