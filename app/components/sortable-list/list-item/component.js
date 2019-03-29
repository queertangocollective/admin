import Component from '@ember/component';
import { computed } from '@ember/object';
import { dasherize } from '@ember/string';

export default Component.extend({

  sortable: true,

  init() {
    this._super(...arguments);
    this._sortDescriptor = {
      name: this.sortAsc,
      ascending: this.displaySortAsc,
      descending: this.displaySortDesc
    };
  },

  sortDesc: computed('sortAsc', function () {
    return `-${this.sortAsc}`;
  }),

  displaySort: computed('sort', function () {
    return this.sort.split('.').map(dasherize).join('.');
  }),

  displaySortAsc: computed('sortAsc', function () {
    return this.sortAsc.split('.').map(dasherize).join('.');
  }),

  displaySortDesc: computed('sortDesc', function () {
    return this.sortDesc.split('.').map(dasherize).join('.');
  }),

  didRender() {
    if (this.list.sortings.findBy('name', this._sortDescriptor.name) == null &&
        this.sortable) {
      this.list.set('sortings', [...this.list.sortings, this._sortDescriptor]);
    }
  }
}).reopenClass({
  positionalParams: ['sortAsc', 'sortDesc']
});
