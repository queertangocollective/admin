import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({

  classNames: ['check-list'],

  readonly: false,

  actions: {
    toggle (item) {
      if (this.readonly) { return; }

      if (typeof item === 'string' &&
          item.match(/^\d+$/g)) {
        item = parseInt(item, 10);
      }

      let value = (this.value || []).slice();
      if (value.indexOf(item) === -1) {
        value.push(item);
      } else {
        value.removeObject(item);
      }
      this.onchange(value);
    }
  }
});
