import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  classNames: ['edit-location-dialog'],

  init() {
    this._super();
    this.store.findRecord('location', this.get('payload.locationId')).then((location) => {
      if (this.isDestroyed) return;
      this.set('location', location);
    });
  },

  submit(payload, changes) {
    payload = Object.assign({}, payload);
    Object.assign(payload, changes);
    this.onsubmit(payload);
  }
});