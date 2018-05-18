import Component from '@ember/component';

export default Component.extend({
  classNames: ['new-ticket-dialog'],

  actions: {
    submit(model, changes) {
      return this.onsubmit(changes).then(this.dismiss);
    }
  }
});

