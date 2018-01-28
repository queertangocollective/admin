import Collection from './collection';

export default Collection.extend({
  actions: {
    createEvent(attributes) {
      let event = this.store.createRecord('event', attributes);
      return event.save().then(() => {
        this.transitionTo('event', event);
      });
    }
  }
});
