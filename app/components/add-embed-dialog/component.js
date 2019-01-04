import Component from "@ember/component";
import { inject as service } from '@ember/service';

export default Component.extend({

  classNames: ['add-embed-dialog'],

  open: service(),

  actions: {
    addItinerary(events) {
      this.onsubmit({
        type: 'itinerary',
        attributes: {
          eventIds: events.mapBy('id')
        }
      });
      this.open.set('dialogs', []);
    },
    addTicket(ticket) {
      this.onsubmit({
        type: 'ticket',
        attributes: {
          ticketId: ticket.get('id'),
          callToAction: 'Sign Up'
        }
      });
      this.open.set('dialogs', []);
    },
    addLocation(location) {
      this.onsubmit({
        type: 'location',
        attributes: {
          locationId: location.get('id'),
          extendedAddress: location.get('extendedAddress')
        }
      });
      this.open.set('dialogs', []);
    },
    addPerson(person) {
      this.onsubmit({
        type: 'person',
        attributes: {
          personId: person.get('id')
        }
      });
      this.open.set('dialogs', []);
    },
    addYoutubeVideo({ url }) {
      this.onsubmit({
        type: 'youtube',
        attributes: {
          url,
          width: 640,
          height: 360,
          autoplay: false
        }
      });
      this.open.set('dialogs', []);
    },
    addPhoto([photo]) {
      this.onsubmit({
        type: 'photo',
        attributes: {
          photoId: photo.get('id'),
          url: photo.get('url'),
          size: 'medium'
        }
      });
      this.open.set('dialogs', []);
    },
    addGallery(photos) {
      this.onsubmit({
        type: 'gallery',
        attributes: {
          style: photos.length > 3 ? 'mosaic' : 'polyptich',
          size: 'medium',
          photoIds: photos.mapBy('id')
        }
      });
      this.open.set('dialogs', []);
    },
    addRiver(section) {
      this.onsubmit({
        type: 'river',
        attributes: {
          channelId: section.get('id')
        }
      });
      this.open.set('dialogs', []);
    }
  }
});
