import Component from '@ember/component';
import { computed, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { bind, next } from '@ember/runloop';

export default Component.extend({
  classNames: ['location-card'],
  store: service(),

  init() {
    this._super();

    if (!this.payload) {
      this.set("payload", {});
    }

    this.registerComponent(this);

    if (this.payload.locationId) {
      this.store.findRecord('location', this.payload.locationId).then((location) => {
        if (this.isDestroyed) return;
        this.set('location', location);
      });
    }
  },

  willDestroyElement() {
    if (this._onMousedownHandler) {
      window.removeEventListener('mousedown', this._onMousedownHandler);
    }
  },

  toolbar: computed('payload.locationId', function () {
    if (this.payload.locationId) {
      return {
        items: [{
          title: 'Change Address Detail',
          text: 'Change Address Detail',
          action: () => {
            this.set('extendedAddress', this.payload.extendedAddress);
            this.set('isChangingExtendedAddress', true);
            this.selectedRange = this.editor.range;
            next(() => {
              this._onMousedownHandler = bind(this, this._handleMousedown);
              window.addEventListener('mousedown', this._onMousedownHandler);
            });
          }
        }, {
          title: 'Choose Location',
          text: 'Choose Location',
          action: () => {
            this.set('isChoosingLocation', true);
          }
        }]
      };
    }
  }),

  _handleMousedown(event) {
    if (!event.target.closest(`#${this.elementId}`)) {
      // no need to re-select for mouse clicks
      this._cancelAndReselect();
    }
  },

  _cancelAndReselect() {
    this.set('isChangingExtendedAddress', false);
    if (this.selectedRange) {
      this.editor.selectRange(this.selectedRange);
      this.selectedRange = null;
      this.editor.enableEditing();
    }

    if (this._onMousedownHandler) {
      window.removeEventListener('mousedown', this._onMousedownHandler);
      this._onMousedownHandler = null;
    }
  },

  actions: {
    addLocation(location) {
      let payload = this.payload;
      let save = this.saveCard;

      set(payload, 'locationId', location.id);
      set(payload, 'extendedAddress', location.extendedAddress);
      this.set('location', location);

      // update the mobiledoc and stay in edit mode
      save(payload, false);
      this.set('isChoosingLocation', false);
    },

    updateExtendedAddress(extendedAddress) {
      let payload = this.payload;
      let save = this.saveCard;

      set(payload, 'extendedAddress', extendedAddress);

      // update the mobiledoc and stay in edit mode
      save(payload, false);
      this._cancelAndReselect();
    },

    cancel() {
      this._cancelAndReselect();
    }
  }
});
