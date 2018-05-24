import Collection from './collection';

export default Collection.extend({

  /* eslint-disable ember/avoid-leaking-state-in-ember-objects */
  filters: {
    q: 'text',
    upcoming: 'upcoming'
  },
  /* eslint-enable ember/avoid-leaking-state-in-ember-objects */

  queryParams: {
    sort: {
      refreshModel: true
    },
    q: {
      refreshModel: true
    },
    upcoming: {
      refreshModel: true
    }
  },

  actions: {
    filterUpcoming(upcoming) {
      this.controller.set('upcoming', upcoming ? true : null);
    },
    createEvent(attributes) {
      let event = this.store.createRecord('event', attributes);
      return event.save().then(() => {
        this.transitionTo('event', event);
      });
    }
  }
});
