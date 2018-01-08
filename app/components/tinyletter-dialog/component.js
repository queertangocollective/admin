import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({
  classNames: ['tinyletter-dialog'],

  actions: {
    submit(_, changes) {
      return get(this, 'onsubmit')(changes).then(get(this, 'dismiss'));
    }
  }
});
