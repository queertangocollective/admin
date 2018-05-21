import Component from '@ember/component';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  init() {
    this._super();
    RSVP.all(
      this.payload.eventIds.map(id => this.store.findRecord('event', id))
    ).then((events) => {
      if (this.isDestroyed) return;
      this.set('events', events);
    });
  },
  actions: {
    save(events) {
      let payload = Object.assign({}, this.payload);
      Object.assign(payload, { eventIds: events.mapBy('id') });
      this.saveCard(payload);
    }
  }
});
