import Component from '@ember/component';
import { set, computed } from '@ember/object';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';

export default Component.extend({

  router: service(),

  classNames: ['sortable-list'],

  classNameBindings: ['name'],

  icon: 'sad',

  init() {
    this._super(...arguments);
    this.set('sortings', A([]));
  },

  isShowingSorting: computed('sort', {
    get() {
      return false;
    },
    set(_, value) {
      return value;
    }
  }),

  currentSort: computed('sort', 'sortings', function () {
    return this.sortings.findBy('ascending', this.sort) ||
           this.sortings.findBy('descending', this.sort);
  }),

  direction: computed('sort', 'currentSort', function () {
    if (this.currentSort == null) return;
    if (this.sort === this.currentSort.ascending) {
      return 'asc';
    } else {
      return 'desc';
    }
  }),

  inverse: computed('sort', 'currentSort', function () {
    if (this.currentSort == null) return;
    if (this.sort === this.currentSort.ascending) {
      return 'descending';
    } else {
      return 'ascending';
    }
  }),

  hasMore: computed('total', 'rows.length', function () {
    return this.total > this.rows.length ? this.rows.length : 0;
  }),

  actions: {
    loadMore(offset) {
      return this.load(offset).then(({ model, meta }) => {
        set(this, 'rows', [...this.rows.toArray(), ...model.toArray()]);
        set(this, 'total', meta.page.total);
      });
    },

    sortMobile(value) {
      if (value == null) return;

      this.set('currentSort', value);
      if (this.onsort) {
        this.onsort(value.name);
      } else {
        this.router.replaceWith({
          queryParams: {
            sort: value.name
          }
        });
      }
    },

    sort(key, evt) {
      if (evt) evt.preventDefault();
      this.onsort(key);
    }
  }
});
