import Component from '@ember/component';
import { set } from '@ember/object';
import { next } from '@ember/runloop';
import { tryInvoke, isEmpty } from '@ember/utils';
import layout from './template';

/**
  A `{{text-field}}` is a drop in replacement
  for `<input type="text">`.

  The simplest `{{text-field}}` would be:

  ```htmlbars
  {{text-field value=score onchange=(action (mut score))}}
  ```

  @public
  @class TextField
  @extends Ember.Component
 */
export default Component.extend({
  layout,
  classNames: ['text-field'],

  /**
    Called whenever the user changes the value.

    @event onchange
    @param {String} value The string
   */

  /**
    The `name` property of the `input` element.

    @property name
    @type String
    @default null
   */
  name: null,

  /**
    The `type` of the `input` element.

    @property type
    @type String
    @default 'text'
   */
  type: 'text',

  /**
    Whether or not the field is disabled.

    @property disabled
    @type Boolean
    @default false
   */
  disabled: false,

  readonly: false,

  didRender() {
    this._updateDisplayValue(this._getValue());
  },

  didInsertElement() {
    if (this.autofocus) {
      this.element.querySelector('input').focus();
      next(this, function () {
        if (this.element) {
          this.element.querySelector('input').focus();
        }
      });
    }
  },

  _getValue() {
    return this.value;
  },

  _setValue(value) {
    if (isEmpty(value) || value == null) {
      this.onchange(null);
    } else {
      this.onchange(value);
    }
    this._updateDisplayValue(value);
  },

  _updateDisplayValue(displayValue) {
    let input = this.element.querySelector('input');

    // No work needs to be done
    if (input.value === displayValue) {
      return;
    }

    let selectionStart = input.selectionStart;
    let selectionEnd = input.selectionEnd;

    input.value = displayValue || '';

    // Only update the cursor position if focused
    if (this.isFocused) {
      if (input.selectionStart !== selectionStart) {
        input.selectionStart = selectionStart;
      }
      if (input.selectionEnd !== selectionEnd) {
        input.selectionEnd = selectionEnd;
      }
    }
  },

  actions: {
    reformat() {
      let input = this.element.querySelector('input');
      this._setValue(input.value);
    },
    keydown(evt) {
      if (evt.which === 27) {
        tryInvoke(this, 'oncancel', [evt]);
      } else if (evt.which === 13) {
        tryInvoke(this, 'onsubmit', [evt]);
      }
    },
    focus() {
      set(this, 'isFocused', true);
      tryInvoke(this, 'onfocus');
    },
    blur() {
      set(this, 'isFocused', false);
      tryInvoke(this, 'onblur');
    }
  }
});
