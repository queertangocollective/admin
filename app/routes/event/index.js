import Resource from '../resource';
import method from 'ember-service-methods/inject';

export default Resource.extend({

  createLocation: method(),

  createPerson: method(),

  afterModel(model) {
    return model.get('venue').then((venue) => {
      if (venue == null) {
        model.set('venue', this.store.createRecord('venue', {
          event: model
        }));
      }
    });
  },

  actions: {
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
    addGuest(evt) {
      evt.preventDefault();
      this.store.createRecord('guest', { event: this.currentModel });
    }
  }
});
