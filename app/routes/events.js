import Collection from './collection';
import { inject as method } from 'ember-service-methods';
import RSVP from 'rsvp';

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
      return RSVP.all(records.map(record => record.destroyRecord()));
    },
    createTicket(Dialog, events) {
      return this.open(Dialog).then((params) => {
        return this.createTicket(params).then((ticket) => {
          return RSVP.all(events.map((event) => {
            let ticketedEvent = this.store.createRecord('ticketed-event', { event, ticket });
            return ticketedEvent.save();
          })).then(() => {
            return ticket;
          });
        });
      }).then((ticket) => {
        this.set('selection', []);
        return this.transitionTo('ticket', ticket);
      });
    },
    createEvent(attributes) {
      let venueParams = attributes.venue;
      delete attributes.venue;

      let event = this.store.createRecord('event', attributes);
      return event.save().then(() => {
        if (venueParams && venueParams.location) {
          let venue = this.store.createRecord('venue', Object.assign({ event }, venueParams));
          return venue.save();
        }
      }).then((venue) => {
        event.set('venue', venue);
        return event.save();
      }).then(() => {
        this.transitionTo('event', event);
      });
    }
  }
});
