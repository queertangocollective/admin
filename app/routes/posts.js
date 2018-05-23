import Collection from './collection';
import method from 'ember-service-methods/inject';

export default Collection.extend({

  createPost: method(),

  filters: {
    q: 'text',
    pinned: 'pinned'
  },

  queryParams: {
    sort: {
      refreshModel: true
    },
    q: {
      refreshModel: true
    },
    pinned: {
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
