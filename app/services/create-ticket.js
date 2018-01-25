import Service, { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Service.extend({

  store: service(),

  execute(attributes) {
    let ticket = get(this, 'store').createRecord('ticket', attributes);
    return ticket.save();
  }
});
