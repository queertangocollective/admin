import Collection from './collection';
import method from 'ember-service-methods/inject';

export default Collection.extend({

  createLocation: method(),

  actions: {
    createLocation(params) {
      return this.createLocation(params).then((location) => {
        this.transitionTo('location', location);
      });
    }
  }
});
