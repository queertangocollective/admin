import Collection from '../../routes/collection';

export default Collection.extend({
  actions: {
    createEvent(attributes) {
      let event = this.store.createRecord('event', attributes);
      return event.save().then(() => {
        this.transitionTo('admin.event', event);
      });
    }
  }
});
