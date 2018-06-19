import Collection from '../collection';

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
    createPurchase() {
      
    }
  }
});
