import Route from '@ember/routing/route';
import { run } from '@ember/runloop';
import { inject as service } from '@ember/service';
import config from '../config/environment';
import fetch from 'fetch';
import method from 'ember-service-methods/inject';

export default Route.extend({

  flash: method(),

  router: service(),

  beforeModel() {
    let url = new URL(location.toString());
    if (url.searchParams.has('token')) {
      localStorage.setItem('qtc-token', url.searchParams.get('token'));

      return this.session.fetch().then(() => {
        this.replaceWith('index');
      });
    } else if (this.session.get('isAuthenticated')) {
      this.replaceWith('index');
    }
  },

  actions: {
    sendMagicLink({ email }) {
      debugger;
      return fetch(config.API_HOST + '/authorization_sessions', {
        method: 'POST',
        headers: {
          'Api-Key': config.API_KEY,
          'Content-Type': 'application/vnd.api+json'
        },
        body: JSON.stringify({
          provider: 'email',
          email,
          'redirect-uri': location.protocol + '//' + location.host + this.router.currentURL
        })
      }).then((response) => {
        if (response.ok) {
          this.flash(`An email was sent to ${email}`, {
            timeout: 5000
          });
        }
      });
    },
    loginWithFacebook() {
      this.session.open('facebook-oauth2').then(() => {
        this.transitionTo('index');
      }, (error) => {
        this.controller.set('error', error);
        setTimeout(() => {
          run(() => {
            this.controller.set('error', null);
          });
        }, 5000);
      });
    },
    loginWithGoogle() {
      this.session.open('google-oauth2').then(() => {
        this.transitionTo('index');
      }, (error) => {
        this.controller.set('error', error);
        setTimeout(() => {
          run(() => {
            this.controller.set('error', null);
          });
        }, 5000);
      });
    }
  }
});
