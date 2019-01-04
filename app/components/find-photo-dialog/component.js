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
    if (this.selection == null) {
      this.set('selection', []);
    }
  },

  actions: {
    select(photo) {
      if (this.multiple) {
        let selection = [...this.selection];
        let index = selection.indexOf(photo)
        if (index === -1) {
          this.set('selection', selection.concat(photo));
        } else {
          selection.splice(index, 1);
          this.set('selection', selection);
        }
      } else {
        this.set('selection', [photo]);
      }
    },
    upload(file) {
      this.onupload(file).then((photo) => {
        this.onsubmit(photo);
      });
    }
  }
});
