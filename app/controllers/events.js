import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';

export default Controller.extend({
  queryParams: ['as'],
  sort: '-ends-at',
  as: 'list',

  init() {
    this._super();
    this.set('results', []);
    if (this.selection == null) {
      this.set('selection', []);
    }
  },

  *fadeIn({ insertedSprites, removedSprites }) {
    yield insertedSprites.map(fadeIn);
    yield removedSprites.map(fadeOut);
  },

  areAllSelected: computed('selection', 'model.model', function () {
    return this.model.model.every((item) => {
      return this.selection.indexOf(item) !== -1;
    });
  }),

  actions: {
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
    clearSelection() {
      this.set('selection', []);
    },
    toggleSelectAll() {
      if (this.areAllSelected) {
        this.set('selection', []);
      } else {
        this.set('selection', this.model.model.toArray());
      }
    }
  }
});
