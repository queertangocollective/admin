import Service, { inject as service } from '@ember/service';

export default Service.extend({

  store: service(),

  execute(attributes) {
    return this.store.createRecord('post', attributes).save();
  }
});
