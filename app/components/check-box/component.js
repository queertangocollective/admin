import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'span',
  classNames: ['check-box'],
  inputId: computed(function () {
    return `${this.elementId}-checkbox`;
  }),

  checkedIcon: 'check_box',
  uncheckedIcon: 'check_box_empty',

  actions: {
    onchange(evt) {
      this.onchange(evt.target.checked);
    }
  }
});
