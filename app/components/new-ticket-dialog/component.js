import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  actions: {
    submit(model, changes) {
      return this.onsubmit(changes).then(this.dismiss);
    }
  }
});

