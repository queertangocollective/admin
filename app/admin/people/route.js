import Collection from '../../routes/collection';

export default Collection.extend({
  actions: {
    createPerson(params) {
      return this.store.createRecord('person', params).save().then((person) => {
        this.transitionTo('admin.person', person);
      });
    }
  }
});
