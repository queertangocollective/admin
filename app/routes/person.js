import Resource from './resource';
import RSVP from 'rsvp';

export default Resource.extend({
  actions: {
    addLogin(model, attributes) {
      attributes.person = model;

      // Adding logins automatically gives access to the admin portal
      if (model.role !== 'staff') {
        model.set('role', 'staff');
      }
      let login = this.store.createRecord('authorization', attributes);
      return RSVP.all([model.save(), login.save()]);
    },
    deleteLogin(model) {
      if (this.currentModel.authorizations.length === 1) {
        this.currentModel.set('role', 'member');
      }
      model.deleteRecord();
      return RSVP.all([model.save(), this.currentModel.save()]).then(() => {
        this.currentModel.authorizations.removeObject(model);
      });
    }
  }
});
