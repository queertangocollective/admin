import { set, get } from '@ember/object';
import Resource from './resource';
import method from 'ember-service-methods/inject';

export default Resource.extend({
  uploadPhoto: method(),
  open: method(),

  actions: {
    addPhoto(model, file) {
      return this.uploadPhoto(file);
    },

    save(model, changes) {
      if (changes.coverPhoto) {
        let change = changes.coverPhoto;
        if (change.blob) {
          change.data = { tags: ['cover-photo'] };
        }
        changes.photos = changes.photos || [];
        changes.photos.push(change);
        delete changes.coverPhoto;
      }

      return this.save(model, changes);
    },
    publish(model) {
      set(model, 'published', true);
      set(model, 'publishedAt', new Date());
      return model.save();
    },
    unpublish(model) {
      set(model, 'published', false);
      set(model, 'publishedAt', null);
      return model.save();
    },
    findOrCreateTicket(FindTicketDialog) {
      return this.open(FindTicketDialog).then((ticket) => {
        return {
          ticketId: get(ticket, 'id'),
          callToAction: 'Sign Up'
        };
      });
    },
    findOrCreateEvent(FindEventDialog) {
      return this.open(FindEventDialog).then((events) => {
        return {
          eventIds: events.mapBy('id')
        };
      });
    }
  }
});
