import Collection from './collection';
import { debounce } from '@ember/runloop';
import { inject as method } from 'ember-service-methods';
import RSVP, { all, resolve } from 'rsvp';

export default Collection.extend({

  open: method(),
  createTicket: method(),

  /* eslint-disable ember/avoid-leaking-state-in-ember-objects */
  filters: {
    q: 'text',
    upcoming: 'upcoming'
  },
  /* eslint-enable ember/avoid-leaking-state-in-ember-objects */

  queryParams: {
    sort: {
      replace: true,
      refreshModel: true
    },
    q: {
      replace: true,
      refreshModel: true
    },
    upcoming: {
      replace: true,
      refreshModel: true
    }
  },

  actions: {
    filterUpcoming(upcoming) {
      this.controller.set('upcoming', upcoming ? true : null);
    },
    deleteAll(records) {
      return RSVP.all(records.map(record => record.destroyRecord())).then(() => {
        this.set('selection', []);
        this.set('hasSelection', false);
      });
    },
    bulkEdit(Dialog) {
      return this.open(Dialog).then(() => {
        this.set('selection', []);
        return this.refresh();
      });
    },
    createEvent(attributes) {
      let venueParams = attributes.venue;
      delete attributes.venue;
      let guestsParams = attributes.guests;
      delete attributes.guests;

      let event = this.store.createRecord('event', attributes);
      return event.save().then(() => {
        if (venueParams && venueParams.location) {
          let venue = this.store.createRecord('venue', Object.assign({ event }, venueParams));
          return venue.save();
        }
      }).then((venue) => {
        event.set('venue', venue);
        return event.save();
      }).then((event) => {
        return all(guestsParams.map(byline => {
          if (byline && byline.person) {
            let guest = this.store.createRecord('guest', Object.assign({ event }, byline));
            return guest.save();
          }
          return resolve();
        })).then(() => {
          debounce(this, 'refresh', 1000);
          return event;
        });
      });
    }
  }
});
