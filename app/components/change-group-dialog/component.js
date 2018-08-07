import Component from '@ember/component';

export default Component.extend({
  classNames: ['change-group-dialog'],

  actions: {
    sort(sort) {
      this.set('sort', sort);
    }
  }
});
