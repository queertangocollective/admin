import { get } from '@ember/object';
import Service, { inject as service } from '@ember/service';

export default Service.extend({

  store: service(),

  execute(attributes) {
    return get(this, 'store').createRecord('post', attributes).save();
  }
});
