import Resource from './resource';

export default Resource.extend({
  actions: {
    addLogin(model, attributes) {
      attributes.person = model;
      let login = this.store.createRecord('authorization', attributes);
      return login.save();
    }
  }
});
