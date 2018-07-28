import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['find-photo-dialog'],
  store: service(),

  multiple: false,
  sort: '-createdAt',

  query() {
    return this.store.query('photo', {
      sort: this.sort,
      page: {
        limit: 50
      }
    }).then((results) => {
      this.set('results', results);
    });
  },

  init() {
    this._super();
    this.query();
  },

  actions: {
    upload(file) {
      this.onupload(file).then((photo) => {
        this.onsubmit(photo);
      });
    }
  }
});
