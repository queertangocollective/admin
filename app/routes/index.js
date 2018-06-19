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
      }),
      events: this.store.query('event', {
        sort: 'ends-at',
        filter: {
          upcoming: true
        },
        page: {
          limit: 10
        }
      })
    });
  }
});
