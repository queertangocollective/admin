import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['find-post-dialog'],
  store: service(),

  sort: 'title',
  q: '',

  query(params) {
    return this.store.query('post', {
      sort: this.sort,
      page: {
        limit: 25,
        offset: params ? params.offset : 0
      }
    }).then((results) => {
      return {
        model: results,
        meta: results.meta
      };
    });
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
    query(query) {
      this.set('q', query);
      this.query();
    },
    sort(sort) {
      this.set('sort', sort);
      this.query();
    },
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
    }
  }
});
