import Route from '@ember/routing/route';
import Authenticatable from 'torii/routing/application-route-mixin';
import method from 'ember-service-methods/inject';

export default Route.extend(Authenticatable, {

  flash: method(),

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
        this.transitionTo('login');
        this.flash('Logged out successfully.', {
          timeout: 5000
        });
      });
    }
  }
});
