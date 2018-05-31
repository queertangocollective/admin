import Component from '@ember/component';
import RSVP from 'rsvp';

export default Component.extend({
  classNames: ['deploy-key-dialog'],

  actions: {
    submit(model, changes) {
      if (changes.key.indexOf('RSA PRIVATE KEY')) {
        return RSVP.reject('Use you public key instead of your private key.');
      }
      return this.oncreate(changes).then(this.dismiss);
    }
  }
});

