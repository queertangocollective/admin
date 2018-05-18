import Component from '@ember/component';

export default Component.extend({
  actions: {
    submit(_, changes) {
      changes.role = 'staff';
      return this.onsubmit(changes);
    }
  }
});
