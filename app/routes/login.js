import Route from '@ember/routing/route';
import { get } from '@ember/object';

export default Route.extend({
  actions: {
    loginWithFacebook() {
      this.session.open('facebook-oauth2').then(() => {
        this.transitionTo('index');
      });
    },
    loginWithGoogle() {
      this.session.open('google-oauth2').then(() => {
        this.transitionTo('index');
      });
    },
    loginWithStripe() {
      this.session.open('stripe').then(() => {
        this.transitionTo('index');
      });
    },
    visitHomepage() {
      window.location = 'https://www.queertangocollective.org';
    }
  }
});
