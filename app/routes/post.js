import Resource from './resource';
import method from 'ember-service-methods/inject';
import { all } from 'rsvp';

export default Resource.extend({
  uploadPhoto: method(),
  open: method(),

  actions: {
    addPhoto(file) {
      return this.uploadPhoto(file);
    },

    save(model, changes) {
      if (changes.coverPhoto) {
        let change = changes.coverPhoto;
        if (change.blob) {
          change.data = { tags: ['cover-photo'] };
        }
        changes.photos = changes.photos || [];
        changes.photos.push(change);
        delete changes.coverPhoto;
      }

      return this.save(model, changes);
    },
    publish(model) {
      let publishedPost = this.store.createRecord('published-post', {
        post: model,
        title: model.title,
        body: model.body,
        slug: model.slug,
        featured: model.pinned,
        channel: model.channel,
        live: true
      });
      return publishedPost.save();
    },
    unpublish(model) {
      let livePosts = model.publishedPosts.filterBy('live', true);
      livePosts.setEach('live', false);
      return all(livePosts.invoke('save'));
    },
    embed(EmbedDialog) {
      return this.open(EmbedDialog);
    }
  }
});
