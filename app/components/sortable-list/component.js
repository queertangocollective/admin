import Component from '@ember/component';
import { set, computed } from '@ember/object';
import RSVP from 'rsvp';
import layout from './template';
import move from 'ember-animated/motions/move';
import opacity from 'ember-animated/motions/opacity';
import { easeInOut as easing } from 'ember-animated/easings/cosine';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';

export default Component.extend({

  layout,

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

  duration: 250,

  fade: function* ({ insertedSprites, removedSprites }) {
    yield RSVP.all([
      ...insertedSprites.map(sprite => opacity(sprite, { from: 0, to: 1 })),
      ...removedSprites.map(sprite => opacity(sprite, { from: 1, to : 0 }))
    ]);
  },

  shuffle: function* ({ insertedSprites, keptSprites, removedSprites }) {
    if (removedSprites.length) {
      yield RSVP.all(removedSprites.map(sprite => {
        return opacity(sprite, { from: 1, to: 0, easing });
      }));
    }
    if (keptSprites.length) {
      yield RSVP.all(keptSprites.map(sprite => {
        sprite.applyStyles({ zIndex: 1 });
        return move(sprite);
      }));
    }
    if (insertedSprites.length) {
      yield RSVP.all(insertedSprites.map(sprite => {
        sprite.scale(0.8);
        return opacity(sprite, { from: 0, to: 1, easing });
      }));
    }
  },

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
