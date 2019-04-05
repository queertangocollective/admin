import Component from '@ember/component';
import { set, computed } from '@ember/object';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import { bind } from '@ember/runloop';

export default Component.extend({

  router: service(),

  classNames: ['sortable-list'],

  classNameBindings: ['name'],

  icon: 'sad',

  init() {
    this._super(...arguments);
    this.set('sortings', A([]));
    this.set('cells', A([]));
  },

  didInsertElement() {
    this._observer = new IntersectionObserver(bind(this, entries => {
      let isInView = entries[entries.length - 1].isIntersecting;
      if (!this.isLoading && isInView && this.hasMore) {
        this.set('isLoading', true);
        this.set('loadingTemplates', new Array(Math.min(this.total - this.rows.length, 50)));
        this.load(this.rows.length).then(({ model, meta }) => {
          this.set('rows', [...this.rows.toArray(), ...model.toArray()]);
          this.set('total', meta.page.total);
        }).finally(() => {
          this.set('isLoading', false);
        });
      }
    }));
  },

  didRender() {
    let lastItem = this.element.querySelector('li:last-child');
    if (lastItem === this._lastItem) return;

    if (this._lastItem) {
      this._observer.unobserve(this._lastItem);
      this._lastItem = null;
    }

    if (lastItem) {
      this._observer.observe(lastItem);
      this._lastItem = lastItem;
    }
  },

  willDestroyElement() {
    if (this._lastItem) {
      this._observer.unobserve(this._lastItem);
      this._lastItem = null;
    }
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
