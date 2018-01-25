import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({
  classNames: ['new-donation-dialog'],

  data: computed({
    get() {
      return {
        paidAt: new Date()
      };
    }
  }),

  actions: {
    submit(model, changes) {
      changes.description = changes.paidBy;
      return get(this, 'onsubmit')(Object.assign(changes, model)).then(get(this, 'dismiss'));
    }
  }
});
