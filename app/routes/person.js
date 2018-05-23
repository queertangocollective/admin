import Resource from './resource';

export default Resource.extend({
  actions: {
    addLogin(model, attributes) {
      attributes.person = model;
      attributes.role = 'staff';
      let login = this.store.createRecord('authorization', attributes);
      return login.save();
    },
    deleteLogin(model) {
      model.deleteRecord();
      return model.save().then(() => {
        this.currentModel.authorizations.removeObject(model);
      });
    }
  }
});
