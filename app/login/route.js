import Ember from 'ember';

const { get } = Ember;

export default Ember.Route.extend({
  actions: {
    loginWithFacebook() {
      get(this, 'session').open('facebook-oauth2').then(() => {
        this.transitionTo('admin');
      });
    },
    loginWithGoogle() {
      get(this, 'session').open('google-oauth2').then(() => {
        this.transitionTo('admin');
      });
    },
    visitHomepage() {
      this.transitionTo('index');
    }
  }
});
