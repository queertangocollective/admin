import Component from '@ember/component';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  init() {
    this._super();
    this.store.findRecord('post', this.payload.postId).then((post) => {
      if (this.isDestroyed) return;
      this.set('post', post);
    });
  },

  actions: {
    nothing() {}
  }
});
