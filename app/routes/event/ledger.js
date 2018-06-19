import Collection from '../collection';

export default Collection.extend({

  /* eslint-disable ember/avoid-leaking-state-in-ember-objects */
  filters: {
    q: 'text',
    eventId: 'event-id'
  },
  /* eslint-enable ember/avoid-leaking-state-in-ember-objects */

  modelName: 'ticketStub',

  query(params) {
    params.eventId = this.modelFor('event').id;
    return this._super(params).then((result) => {
      result.event = this.modelFor('event');
      return result;
    });
  },

  actions: {
    createPurchase() {

    }
  }
});
