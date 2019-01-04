import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  init() {
    this._super();
    this.store.query('post', { filter: { channel_id: this.payload.channelId } }).then((posts) => {
      if (this.isDestroyed) return;
      this.set('posts', posts);
    });
  },

  actions: {
    nothing() {}
  }
});
