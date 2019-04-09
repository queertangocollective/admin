import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['find-section-dialog'],
  session: service(),

  sort: 'title',
  q: '',

  query() {
    this.session.get('currentGroup.channels').then((results) => {
      this.set('results', results);
    });
  },

  init() {
    this._super();
    this.query();
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
    select(item) {
      if (this.selected === item) {
        this.set('selected', null);
      } else {
        this.set('selected', item);
      }
    }
  }
});
