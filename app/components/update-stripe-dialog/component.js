import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  actions: {
    submit(model, changes) {
      return this.onsave(model, changes).then(this.dismiss);
    }
  }
});

