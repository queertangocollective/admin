import Component from '@ember/component';
import RSVP from 'rsvp';
import { computed, set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),

  init() {
    this._super();

    if (!this.payload) {
      this.set("payload", {});
    }

    this.registerComponent(this);
  },

  didReceiveAttrs() {
    RSVP.all(
      (this.payload.eventIds || []).map(id => this.store.findRecord('event', id))
    ).then((events) => {
      if (this.isDestroyed) return;
      this.set('selection', events);
      this.set('events', events.sortBy('startsAt'));
    });
  },

  toolbar: computed('payload.eventIds.length', function () {
    if (this.payload.eventIds && this.payload.eventIds.length > 0) {
      return {
        items: [{
          title: 'Choose Events',
          text: 'Choose Events',
          action: () => {
            this.set('isAddingEvents', true);
          }
        }]
      };
    }
  }),

  actions: {
    nothing() {},
    addEvents(events) {
      let payload = this.payload;
      let save = this.saveCard;

      set(payload, 'eventIds', events.mapBy('id'));
      this.set('selection', events);
      this.set('events', events.sortBy('startsAt'));

      // update the mobiledoc and stay in edit mode
      save(payload, false);
      this.set('isAddingEvents', false);
    }
  }
});
