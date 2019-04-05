import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['find-photo-dialog'],
  store: service(),

  multiple: false,
  sort: '-createdAt',

  query(params) {
    return this.store.query('photo', {
      sort: this.sort,
      page: {
        limit: 15,
        offset: params ? params.offset : 0
      }
    }).then((results) => {
      return {
        model: results,
        meta: results.meta
      };
    })
  },

  load(offset) {
    return this.query({ offset });
  },

  init() {
    this._super();
    this.query().then(({ model, meta }) => {
      this.set('meta', meta);
      this.set('results', model);
    });
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
