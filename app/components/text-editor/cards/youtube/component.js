import Component from '@ember/component';
import { computed, get } from '@ember/object';
import layout from './template';

export default Component.extend({
  classNames: ['youtube-card'],

  layout,

  videoId: computed('payload.url', {
    get() {
      let url = get(this, 'payload.url');
      return (
        url.match(/youtube\.com\/watch\?v=([^/]+)/) ||
        url.match(/youtu.be\/([^/]+)/) ||
        url.match(/youtube\.com\/embed\/([^/]+)/)
      )[1];
    }
  }),

  origin: computed({
    get() {
      return window.protocol + '//' + window.hostname;
    }
  })
});
