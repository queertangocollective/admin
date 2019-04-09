import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({
  tagName: '',

  data: computed({
    get() {
      return {
        paidAt: new Date()
      };
    }
  }),

  actions: {
    submit(model, changes) {
      return get(this, 'onsubmit')(Object.assign(changes, model)).then(get(this, 'dismiss'));
    }
  }
});
