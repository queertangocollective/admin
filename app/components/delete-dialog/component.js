import Component from '@ember/component';
import { get, computed } from '@ember/object';

export default Component.extend({
  modelName: computed('model', {
    get() {
      return get(this, 'model.constructor.modelName');
    }
  }),

  actions: {
    submit() {
      return get(this, 'onsubmit')().then(get(this, 'dismiss'));
    }
  }
});
