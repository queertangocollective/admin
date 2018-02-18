import Route from '@ember/routing/route';
import Authenticatable from 'torii/routing/application-route-mixin';

export default Route.extend(Authenticatable, {

  afterModel() {
    if (!this.session.get('isAuthenticated')) {
      this.replaceWith('login');
    }
  },

  actions: {
    query(modelName, filter) {
      return this.store.query(modelName, {
        filter
      });
    },

    logout() {
      return this.session.close().then(() => {
        this.transitionTo('/');
        this.flash('Logged out successfully.', {
          timeout: 5000
        });
      });
    }
  }
});
