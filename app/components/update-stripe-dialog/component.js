import Component from '@ember/component';

export default Component.extend({
  classNames: ['update-stripe-dialog'],

  actions: {
    submit(model, changes) {
      return this.onsave(model, changes).then(this.dismiss);
    }
  }
});

