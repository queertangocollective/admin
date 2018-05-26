import Route from '@ember/routing/route';

export default Route.extend({
  setupController() {
    this._super(...arguments);
    this.controller.setProperties({
      transactions: this.store.query('transaction', {
        sort: '-created-at',
        page: {
          limit: 10
        }
      })
    });
  }
});
