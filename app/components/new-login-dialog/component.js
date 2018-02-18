import Component from '@ember/component';
import { get } from '@ember/object';
import { not } from '@ember/object/computed';

export default Component.extend({
  isFormOpen: not('logins.length'),
  actions: {
    submit(_, changes) {
      changes.role = 'staff';
      return get(this, 'onsubmit')(changes).then(get(this, 'dismiss'));
    }
  }
});
