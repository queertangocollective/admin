import Component from '@ember/component';
import { set } from '@ember/object';
import { tryInvoke, isEmpty } from '@ember/utils';

/**
  A `{{password-field}}` is a drop in replacement
  for `<input type="password">`.

  The simplest `{{password-field}}` would be:

  ```htmlbars
  {{password-field value=score onchange=(action (mut score))}}
  ```

  @public
  @class PasswordField
  @extends Ember.Component
 */
export default Component.extend({

  classNames: ['password-field'],

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
    Whether or not the field is disabled.

    @property disabled
    @type Boolean
    @default false
   */
  disabled: false,

  didRender() {
    this._updateDisplayValue(this._getValue());
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
    let selectionStart = input.selectionStart;
    let selectionEnd = input.selectionEnd;

    input.value = displayValue || '';

    if (this.isFocused) {
      input.selectionStart = selectionStart;
      input.selectionEnd = selectionEnd;
    }
  },

  actions: {
    reformat() {
      let input = this.element.querySelector('input');
      this._setValue(input.value);
    },
    blur() {
      set(this, 'isFocused', false);
      tryInvoke(this, 'onblur');
    },
    focus() {
      set(this, 'isFocused', true);
    }
  }
});
