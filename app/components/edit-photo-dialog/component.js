import Component from '@ember/component';

export default Component.extend({
  classNames: ['edit-photo-dialog'],

  submit(payload, changes) {
    payload = Object.assign({}, payload);
    Object.assign(payload, changes);
    this.onsubmit(payload);
  }
});