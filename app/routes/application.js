import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { inject as method } from 'ember-service-methods';
import Authenticatable from 'torii/routing/application-route-mixin';

export default Route.extend(Authenticatable, {

  flash: method(),

  intl: service(),

  raven: service(),

  beforeModel() {
    this.intl.setLocale(['en']);
    return this._super();
  },

  afterModel() {
    if (!this.session.get('isAuthenticated')) {
      this.replaceWith('login');
    } else if (this.session.get('currentGroup.locale')) {
      this.raven.callRaven('setUserContext', {
        id: this.session.get('currentUser.id'),
        name: this.session.get('currentUser.name')
      });
      this.intl.setLocale([this.session.get('currentGroup.locale'), 'en']);
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
