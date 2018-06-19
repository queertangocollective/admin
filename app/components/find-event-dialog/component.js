import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';

export default Component.extend({
  classNames: ['find-event-dialog'],
  store: service(),

  sort: '-endsAt',
  q: '',
  isLoading: true,

  *fade({ insertedSprites, removedSprites }) {
    insertedSprites.map(fadeIn);
    removedSprites.map(fadeOut);
    yield;
  },

  query() {
    this.set('isLoading', true);
    return this.store.query('event', {
      sort: this.sort,
      page: {
        limit: 50
      },
      filter: {
        text: this.q
      }
    }).then((results) => {
      if (this.isDestroyed) return;
      this.set('isLoading', false);
      this.set('results', results);
    });
  },

  init() {
    this._super();
    this.query();
    this.set('results', []);
    if (this.selection == null) {
      this.set('selection', []);
    }
    if (this.disabled) {
      this.set('disabledIds', this.disabled.mapBy('id'));
    } else {
      this.set('disabledIds', []);
    }
  },

  areAllSelected: computed('selection', 'results', function () {
    return this.results.filter((item) => {
      return this.disabledIds.indexOf(item.id) === -1;
    }).every((item) => {
      return this.selection.indexOf(item) !== -1;
    });
  }),

  actions: {
    query(query) {
      this.set('q', query);
      this.query();
    },
    select(item) {
      let selection = this.selection.slice();
      let index = selection.indexOf(item);
      if (index === -1) {
        selection.push(item);
      } else {
        selection.splice(index, 1);
      }
      this.set('selection', selection);
    },
    toggleSelectAll() {
      if (this.areAllSelected) {
        this.set('selection', []);
      } else {
        this.set('selection', this.results.toArray().filter((result) => {
          return this.disabledIds.indexOf(result.id) === -1;
        }));
      }
    },
    submit(selection) {
      return this.onsubmit(selection);
    }
  }
});
