import Resource from './resource';
import RSVP from 'rsvp';

export default Resource.extend({

  actions: {
    createTicketedEvents(ticket, events) {
      return RSVP.all(events.map((event) => {
        let ticketedEvent = this.store.createRecord('ticketed-event', {
          ticket, event
        });
        return ticketedEvent.save();
      }));
    }
  }
});
