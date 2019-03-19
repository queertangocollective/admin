import Collection from '../collection';
import { all } from 'rsvp';

export default Collection.extend({

  /* eslint-disable ember/avoid-leaking-state-in-ember-objects */
  filters: {
    q: 'text',
    ticketId: 'ticket-id'
  },
  /* eslint-enable ember/avoid-leaking-state-in-ember-objects */

  modelName: 'transaction',

  query(params) {
    params.ticketId = this.modelFor('ticket').id;
    return this._super(params).then((result) => {
      result.ticket = this.modelFor('ticket');
      return result;
    });
  },

  actions: {
    createPurchase(_, params) {
      let ticket = this.modelFor('ticket');

      let transaction = this.store.createRecord('transaction', {
        description: ticket.description,
        paidAt: new Date(),
        paidBy: params.paidBy,
        paymentMethod: params.paymentMethod,
        amountPaid: params.paymentMethod === 'free' ? 0 : params.amountPaid,
        currency: params.currency,
        paymentProcessorUrl: params.paymentProcessorUrl
      });

      return transaction.save().then(purchase => {
        return ticket.ticketedEvents.then(ticketedEvents => {
          return all(ticketedEvents.map(ticketedEvent => {
            return ticketedEvent.event.then(event => {
              let stub = this.store.createRecord('ticket-stub', {
                ticket,
                person: params.paidBy,
                event,
                purchase,
                attended: false
              });
              return stub.save();
            });
          }));
        });
      });
    }
  }
});
