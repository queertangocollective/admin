import Component from '@ember/component';
import { guidFor } from '@ember/object/internals';
import { computed } from '@ember/object';
import RSVP from 'rsvp';
import layout from './template';

export default Component.extend({
  layout,

  classNames: ['select-field'],

  disabled: false,

  init() {
    this._super(...arguments);
    RSVP.resolve(this.value).then((value) => {
      if (value == null && this.options.length > 0) {
        this.onchange(this.options[0]);
      }
    });
  },

  arrangedOptions: computed('options.[]', function () {
    return this.options.map((option) => {
      return {
        id: guidFor(option),
        value: option
      };
    });
  }),

  selected: computed('value', function () {
    return {
      id: guidFor(this.value),
      value: this.value
    };
  }),

  selectIndex(evt) {
    let index = evt.target.selectedIndex;
    this.onchange(this.options[index]);
    evt.preventDefault();
    evt.stopPropagation();
  }
});
