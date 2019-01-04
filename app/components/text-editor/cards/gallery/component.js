import Component from '@ember/component';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  init() {
    this._super();
    RSVP.all(
      (this.payload.photoIds || []).map(id => this.store.findRecord('photo', id))
    ).then((photos) => {
      if (this.isDestroyed) return;
      this.set('photos', photos);
    });
  },

  actions: {
    nothing() {}
  }
});
