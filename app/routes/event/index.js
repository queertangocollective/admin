import Resource from '../resource';
import method from 'ember-service-methods/inject';

export default Resource.extend({

  createLocation: method(),

  createPerson: method(),

  actions: {
    save(model, changes) {
      return this.save(model, changes);
    },
    delete(model) {
      return model.deleteRecord();
    },
    createPerson(guest, params) {
      return this.createPerson(params).then(function (person) {
        guest.set('person', person);
      });
    },
    createLocation(venue, params) {
      return this.createLocation(params).then(function (location) {
        venue.set('location', location);
      });
    },
    addVenue(event) {
      return this.store.createRecord('venue', { event });
    },
    addGuest(event) {
      return this.store.createRecord('guest', { event });
    }
  }
});
