import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['find-ticket-dialog'],
  store: service(),

  sort: 'description',
  q: '',

  query() {
    return this.get('store').query('event', {
      sort: this.get('sort'),
      page: {
        limit: 50
      },
      filter: {
        text: this.get('q')
      }
    }).then((results) => {
      this.set('results', results);
    });
  },

  init() {
    this._super();
    this.query();
    this.set('results', []);
    this.set('selection', []);
  },

  areAllSelected: computed('selection', 'results', function () {
    return this.get('results').every((item) => {
      return this.get('selection').indexOf(item) !== -1;
    });
  }),

  actions: {
    query(query) {
      this.set('q', query);
      this.query();
    },
    select(item) {
      let selection = this.get('selection').slice();
      let index = selection.indexOf(item);
      if (index === -1) {
        selection.push(item);
      } else {
        selection = selection.splice(index, 1);
      }
      this.set('selection', selection);
    },
    toggleSelectAll() {
      if (this.get('areAllSelected')) {
        this.set('selection', []);
      } else {
        this.set('selection', this.get('results').toArray());
      }
    }
  }
});
