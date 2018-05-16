import { get } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import method from 'ember-service-methods/inject';

export default Service.extend({

  store: service(),

  uploadPhoto: method(),

  execute(attributes) {
    let location = this.store.createRecord('location', attributes);
    return location.save().then((location) => {
      if (attributes.photo) {
        return this.uploadPhoto(attributes.photo).then((photo) => {
          location.set('photo', photo);
          return location.save();
        });
      }
      return location;
    });
  }
});
