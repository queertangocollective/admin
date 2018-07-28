import Resource from './resource';
import method from 'ember-service-methods/inject';

export default Resource.extend({
  save: method(),
  actions: {
    save(model, changes) {
      return this.save(model, changes);
    }
  }
});
