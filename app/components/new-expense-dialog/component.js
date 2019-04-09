import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  session: service(),

  data: computed({
    get() {
      return {
        paidAt: new Date(),
        paidBy: get(this, 'person'),
        currency: 'USD'
      };
    }
  }),

  actions: {
    submit(model, changes) {
      changes.amountPaid = Math.abs(changes.amountPaid) * -1;
      return get(this, 'onsubmit')(Object.assign(changes, model)).then(get(this, 'dismiss'));
    }
  }
});

