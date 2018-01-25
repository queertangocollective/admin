import Route from '@ember/routing/route';
import method from 'ember-service-methods/inject';

export default Route.extend({

  uploadPhoto: method(),

  actions: {
    addPhoto(model, file) {
      return this.uploadPhoto(file);
    }
  }
});
