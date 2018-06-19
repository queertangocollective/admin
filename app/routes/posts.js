import Collection from './collection';
import method from 'ember-service-methods/inject';

export default Collection.extend({

  createPost: method(),

  /* eslint-disable ember/avoid-leaking-state-in-ember-objects */
  filters: {
    q: 'text',
    pinned: 'pinned'
  },
  /* eslint-enable ember/avoid-leaking-state-in-ember-objects */

  queryParams: {
    sort: {
      replace: true,
      refreshModel: true
    },
    q: {
      replace: true,
      refreshModel: true
    },
    pinned: {
      replace: true,
      refreshModel: true
    }
  },

  actions: {
    pin(post, pinned) {
      post.set('pinned', pinned);
      post.save();
    },
    filterPinned(pinned) {
      this.controller.set('pinned', pinned ? true : null);
    },
    createPost(params) {
      return this.createPost(params).then((post) => {
        this.transitionTo('post', post);
      });
    }
  }
});
