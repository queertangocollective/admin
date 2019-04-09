import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({
  tagName: '',

  model: computed('ticket', function () {
    return {
      description: this.ticket.description,
      currency: this.ticket.currency,
      paidAt: new Date(),
      amountPaid: this.ticket.cost,
      paymentMethod: 'cash'
    }
  }),

  actions: {
    submit(model, changes) {
      return get(this, 'onsubmit')(Object.assign({}, model, changes)).then(get(this, 'dismiss'));
    }
  }
});

