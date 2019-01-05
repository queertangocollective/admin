import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'button',
  classNameBindings: ['active'],

  active: computed('option', 'value', function () {
    return this.option === this.value;
  }),

  click() {
    this.onchange(this.option);
    return false;
  }
}).reopenClass({
  positionalParams: ['option']
});
