import Route from '@ember/routing/route';

export default Route.extend({
  setupController() {
    this._super(...arguments);
    this.controller.setProperties({
      transactions: this.store.query('transaction', {
        sort: '-created-at',
        page: {
          offset: 0,
          limit: 10
        },
        include: 'paid-by'
      }),
      events: this.store.query('event', {
        sort: 'ends-at',
        filter: {
          upcoming: true
        },
        page: {
          offset: 0,
          limit: 10
        }
      })
    });
  }
});
