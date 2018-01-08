import Component from '@ember/component';
import { get } from '@ember/object';
import RSVP from 'rsvp';

export default Component.extend({

  didReceiveAttrs() {
    RSVP.resolve(get(this, 'value')).then((photos) => {
      photos = photos || [];
      this._photos = photos.slice();
    });
  },

  actions: {
    add(photo) {
      let photos = this._photos;
      photos.push(photo);
      get(this, 'onchange')(photos);
    },
    change(index, photo) {
      let photos = this._photos.slice();
      if (photo) {
        photos.splice(index, 1, photo);
      } else {
        photos.splice(index, 1);
      }
      get(this, 'onchange')(photos);
    }
  }
});
