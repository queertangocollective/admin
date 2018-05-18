import Service, { inject as service } from '@ember/service';

export default Service.extend({

  store: service(),

  execute(attributes) {
    let ticket = this.store.createRecord('ticket', attributes);
    return ticket.save();
  }
});
