import {
    defineWidget,
    log,
    runCallback,
} from 'widget-base-helpers';
import Cleave from 'cleave.js';
import template from './CurrencyInput.template.html';

export default defineWidget('CurrencyInput', template, {

    _obj: null,
    _cleave: null,
    // modeler
    attribute: null,
    textRight: null,
    label: null,
    display: null,
    width: null,
    // nodes
    inputNode: null,
    controlNode: null,
    labelNode: null,

    constructor() {
        this.log = log.bind(this);
        this.runCallback = runCallback.bind(this);
    },

    postCreate() {
        log.call(this, 'postCreate', this._WIDGET_VERSION);
        // init
        this._cleave = new Cleave(this.inputNode, {
            numeral: true,
            numeralThousandsGroupStyle: 'thousand',
            prefix: '$',
            noImmediatePrefix: true,
            numeralPositiveOnly: true,
            rawValueTrimPrefix: true,
            onValueChanged: e => {
                this._handleValueChanged(e.target.rawValue);
            }
        });

    },

    update(obj, cb) {
        this._contextObj = obj;
        this._updateRendering();
        this._resetSubscriptions();
        if (cb) cb();
    },

    _resetSubscriptions() {
        this.unsubscribeAll();
        this.subscribe({
            guid: this._contextObj.getGuid(),
            attr: this.attribute,
            callback: (guid, attr, attrValue) => {
                this._updateRendering();
            }
        });
        this.subscribe({
            entity: this._contextObj.metaData.getEntity(),
            callback: entity => {
                this._updateRendering();
            }
        });
    },

    _updateRendering() {
        this._cleave.setRawValue(this._contextObj.get(this.attribute) * 1);
        this.labelNode.innerText = this.label;
        if (this.textRight) {
            this.inputNode.style.textAlign = "right";
        }
        if (this.display === "hor") {
            // horizontal
            this.labelNode.classList.add("col-sm-" + this.width);
            this.controlNode.classList.add("col-sm-" + (12 - this.width));
        } else {
            // vertical
        }
    },

    _handleValueChanged(rawValue) {
        console.log(rawValue);
        this._contextObj.set(this.attribute, rawValue);
    },
});