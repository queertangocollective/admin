import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({
  classNames: ['add-purchase-dialog'],

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
      changes.amount = Math.abs(changes.amount) * -1;
      return get(this, 'onsubmit')(Object.assign(changes, model)).then(get(this, 'dismiss'));
    }
  }
});

