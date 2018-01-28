import Collection from './collection';
import method from 'ember-service-methods/inject';

export default Collection.extend({

  createTransaction: method(),

  modelName: 'transaction',

  actions: {
    createTransaction(params) {
      return this.createTransaction(params).then((transaction) => {
        this.transitionTo('transaction', transaction);
      });
    }
  }
});
