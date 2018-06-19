import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['balance-bar'],
  classNameBindings: ['status'],
  status: computed('balance.amount', function () {
    if (this.balance) {
      if (this.balance.amount > 10000) {
        return 'positive';
      } else if (this.balance.amount > 0) {
        return 'low';
      } else {
        return 'negative';
      }
    }
  })
});
