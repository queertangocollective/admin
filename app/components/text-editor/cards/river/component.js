import Component from '@ember/component';
import { computed, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { all } from "rsvp";

export default Component.extend({
  store: service(),
  init() {
    this._super();

    if (!this.payload) {
      this.set("payload", {
        channelId: null,
        featured: false,
        postIds: []
      });
    }

    this.registerComponent(this);

    if (this.payload.channelId) {
      this.store.findRecord('channel', this.payload.channelId).then(channel => {
        this.set('section', channel);
      });
    }

    this.updatePreview();
  },

  toolbar: computed('payload.{channelId,featured,postIds}', function () {
    if (this.payload.channelId ||
        (this.payload.postIds && this.payload.postIds.length) ||
        this.payload.featured) {
      return {
        items: [{
          title: 'Featured Posts',
          icon: this.payload.featured ? 'star' : 'star_border',
          active: this.payload.featured,
          action: () => {
            if (this.payload.featured) {
              this._updatePayload({ featured: undefined });
            } else {
              this._updatePayload({ featured: true });
            }
            this.updatePreview();
          }
        }, {
          title: 'Select Section',
          text: 'Select Section',
          action: () => {
            this.set('isSelectingSection', true);
            this.selectedRange = this.editor.range;
          }
        }, {
          title: 'Select Posts',
          text: 'Select Posts',
          action: () => {
            this.set('isSelectingPosts', true);
            this.selectedRange = this.editor.range;
          }
        }]
      };
    }
  }),

  _updatePayload(attrs) {
    let payload = this.payload;

    Object.keys(attrs).forEach(key => {
      set(payload, key, attrs[key]);
    });

    // update the mobiledoc and stay in edit mode
    this.saveCard(payload, false);
  },

  updatePreview() {
    if (this.payload.postIds && 
        this.payload.postIds.length > 0) {
      all(this.payload.postIds.map(id => this.store.findRecord('post', id))).then(posts => {
        if (this.isDestroyed) return;
        this.set("isLoading", false);
        this.set("posts", posts);
        this.set("selection", posts.slice());
      });
      return;
    }

    let filter = {};
    if (this.payload.channelId) {
      filter.channel_id = this.payload.channelId;
    }
    if (this.payload.featured) {
      filter.pinned = true;
    }

    this.store.query('post', { filter }).then((posts) => {
      if (this.isDestroyed) return;
      this.set('posts', posts);
    });
  },

  actions: {
    setChannel(channel) {
      if (channel == null) {
        this._updatePayload({ channelId: undefined, postIds: [] });
      } else {
        this._updatePayload({ channelId: channel.id, postIds: [] });
      }
      this.set("selection", []);
      this.set('section', channel);
      this.set('isSelectingSection', false);
      this.updatePreview();
    },
    setPosts(posts) {
      this._updatePayload({
        featured: undefined,
        channelId: undefined,
        postIds: posts.mapBy('id')
      });
      this.set('isSelectingPosts', false);
      this.set('section', null);
      this.updatePreview();
    },
    nothing() {}
  }
});
