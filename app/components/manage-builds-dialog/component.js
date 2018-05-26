import Component from '@ember/component';

export default Component.extend({
  classNames: ['manage-builds-dialog'],

  didReceiveAttrs() {
    this.builds.then((builds) => {
      this.set('rows', builds.sortBy('createdAt').reverse());
    });
  }
});
