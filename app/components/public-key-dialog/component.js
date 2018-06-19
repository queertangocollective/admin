import Component from '@ember/component';
import RSVP from 'rsvp';
import sort from '../../computed/sort';

export default Component.extend({
  classNames: ['deploy-key-dialog'],

  sort: 'name',
  sortedPublicKeys: sort('publicKeys', 'sort'),

  actions: {
    submit(model, changes) {
      if (changes.key.indexOf('RSA PRIVATE KEY') !== -1) {
        return RSVP.reject('Use you public key instead of your private key.');
      }
      return this.oncreate(changes).then(this.dismiss);
    }
  }
});

