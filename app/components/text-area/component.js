import Component from '@ember/component';
import { computed, set, get } from '@ember/object';
import { isNone, isEmpty } from '@ember/utils';
import Autoresize from 'ember-autoresize/mixins/autoresize';
import layout from './template';

/**
  A `{{text-area}}` is a drop in replacement
  for `<textarea>`.

  The simplest `{{text-area}}` would be:

  ```htmlbars
  {{text-area value=score onchange=(action (mut score))}}
  ```

  @public
  @class TextArea
  @extends Ember.Component
 */
export default Component.extend(Autoresize, {
  layout,
  classNames: ['text-area'],

  /**
    Called whenever the user changes the value.

    @event onchange
    @param {String} value The string
   */

  /**
    The `name` property of the `textarea` element.

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

  autoresize: true,

  shouldResizeHeight: true,

  significantWhitespace: true,

  autoresizeElement: computed({
    set(_, value) {
      return value;
    }
  }),

  autoResizeText: computed('value', {
    get() {
      var value = get(this, 'value');
      if (isNone(value)) {
        value = '';
      }
      return value + '@';
    }
  }),

  didRender() {
    set(this, 'autoresizeElement', this.$('textarea')[0]);
    this._updateDisplayValue(this._getValue());
  },

  _getValue() {
    return get(this, 'value');
  },

  _setValue(value) {
    if (isEmpty(value) || value == null) {
      get(this, 'onchange')(null);
    } else {
      get(this, 'onchange')(value);
    }
    this._updateDisplayValue(value);
  },

  _updateDisplayValue(displayValue) {
    let textarea = get(this, 'element').querySelector('textarea');
    let selectionStart = textarea.selectionStart;
    let selectionEnd = textarea.selectionEnd;

    textarea.value = displayValue || '';

    if (get(this, 'isFocused')) {
      textarea.selectionStart = selectionStart;
      textarea.selectionEnd = selectionEnd;
    }
  },

  actions: {
    reformat() {
      let textarea = get(this, 'element').querySelector('textarea');
      this._setValue(textarea.value);
    }
  }
});
