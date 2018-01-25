import Route from '@ember/routing/route';
import config from '../config/environment';

export default Route.extend({

  beforeModel(transition) {
    return this.store.findAll('group').then(function (groups) {
      return groups.get('firstObject');
    });
  },

  model() {
    return this.store.peekAll('group').get('firstObject');
  }
});
