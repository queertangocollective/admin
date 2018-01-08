import Collection from '../../routes/collection';
import method from 'ember-service-methods/inject';

export default Collection.extend({

  createTicket: method(),

  actions: {
    createTicket(params) {
      return this.createTicket(params).then((ticket) => {
        this.transitionTo('admin.ticket', ticket);
      });
    }
  }
});
