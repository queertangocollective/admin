import Component from '@ember/component';
import { set, computed } from '@ember/object';
import { inject as service } from '@ember/service';

const UP = 38;
const DOWN = 40;

/**
  A `{{number-field}}` is a drop in replacement
  for `<input type="number">`.

  The number field formats numbers in a friendly
  manner for users, making larger numbers easier
  to read.

  The simplest `{{number-field}}` would be:

  ```htmlbars
  {{number-field value=score onchange=(action (mut score))}}
  ```

  This would result in a free form number field that
  would allow users to choose any number. If we
  wanted to restrict the score to be from 0 to 100, we would
  add `min` and `max` properties:

  ```htmlbars
  {{number-field value=score min=0 max=100 onchange=(action (mut score))}}
  ```

  Say we have another use case, where we want to show
  allow users to enter percentages up to 2 decimals.
  The configuration that would allow this would be:

  ```htmlbars
  {{number-field value=percent min=0 max=100 precision=2 onchange=(action (mut percent))}}
  ```

  @public
  @class NumberField
  @extends ClassyInput
 */
export default Component.extend({

  classNames: ['number-field'],

  /**
    Called whenever the user changes the value.

    @event onchange
    @param {Number} value The floating point number
   */

  /**
    The `label` property is the floating label used
    by the `classy-input`.

    @property label
    @type String
    @default null
   */
  label: null,

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

  /**
    The minimum possible number for the field.

    @property min
    @type Number
    @default Number.MIN_SAFE_INTEGER
   */
  min: Number.MIN_SAFE_INTEGER,

  /**
    The maximum possible number for the field.

    @property max
    @type Number
    @default Number.MAX_SAFE_INTEGER
   */
  max: Number.MAX_SAFE_INTEGER,

  /**
    When using arrow keys, the number will increment
    or decrement the amount that `step` defines. This
    is analagous to the `step` property on `input` fields
    native to browsers.

    @property step
    @type Number
    @default 1
   */
  step: 1,

  /**
    The precision of the number. This refers to the
    number of decimal places that should be allowed for
    the number.

    @property precision
    @type Number
    @default 0
   */
  precision: 0,

  style: 'decimal',

  intl: service(),

  isFocused: false,

  multiplier: 1,

  formatter: computed('style', 'intl.locale', 'currency', 'precision', function () {
    let options = {
      style: this.style
    };

    if (this.currency) {
      options.currency = this.currency;
    }
    if (this.precision != null) {
      options.maximumFractionDigits = this.precision;
    }
    return Intl.NumberFormat(this.intl.locale, options);
  }),

  symbol: computed('decimalSeparator', 'groupingSeparator', function () {
    let test = this.formatter.format(9876543.21);
    return test.replace(/\d/g, '')
               .replace(new RegExp('[' + this.decimalSeparator + ']', 'g'), '')
               .replace(new RegExp('[' + this.groupingSeparator + ']', 'g'), '').trim();
  }),

  decimalSeparator: computed('formatter', function () {
    let test = this.formatter.format(9876543.21);
    let separator = test.charAt(test.indexOf('21') - 1);
    if (separator.match(/\d/)) {
      return '';
    }
    return separator;
  }),

  groupingSeparator: computed('formatter', function () {
    let test = this.formatter.format(9876543.21);
    let groupingSeparatorIndex = test.indexOf('3');
    while (test.charAt(groupingSeparatorIndex).match(/\d/)) {
      groupingSeparatorIndex--;
    }

    return test.charAt(groupingSeparatorIndex);
  }),

  maximumFractionDigits: computed('formatter', function () {
    return this.formatter.resolvedOptions().maximumFractionDigits;
  }),

  didRender() {
    this._updateDisplayValue(this._getValue());
  },

  _getValue() {
    if (this.isFocused) {
      let input = this.element.querySelector('input');
      return input.value;
    } else {
      let value = this.value;
      return value ? this._format(value) : '';
    }
  },

  _setValue(displayValue) {
    let value = this._applyPrecision(displayValue);
    this.onchange(value);
    this._updateDisplayValue(displayValue);
  },

  _stepValue(step) {
    this._setValue(this._format(this._clamp((this.value || 0) + step)));
  },

  _updateDisplayValue(displayValue) {
    let input = this.element.querySelector('input');
    let cursorPosition = input.selectionStart;
    let lastDisplayValue = input.value;

    input.value = displayValue;

    this._moveCursor(cursorPosition, lastDisplayValue, displayValue);
  },

  // Appends `precision` characters from old string
  _trimDecimals(oldString, newString, precision) {
    let trimmedString = newString;

    if (trimmedString.indexOf(this.decimalSeparator) === -1 &&
        oldString.indexOf(this.decimalSeparator) !== -1) {
      trimmedString += this.decimalSeparator + oldString.slice(
        oldString.indexOf(this.decimalSeparator),
        oldString.indexOf(this.decimalSeparator) + precision + 1
      ).replace(new RegExp(this.decimalSeparator, 'g'), '');
    }

    return trimmedString;
  },

  _format(number) {
    if (isNaN(number) || number == null) {
      return number || '';
    }
    return this.formatter.format(number);
  },

  _moveCursor(previousCursorPosition, previousValue, newValue) {
    if (!this.isFocused) {
      return;
    }

    let input = this.element.querySelector('input');
    let newCursorPosition = previousCursorPosition;

    if (newCursorPosition !== null) {
      if (newCursorPosition === previousValue.length) {
        newCursorPosition = newValue.length;
      } else if (previousValue !== newValue) {
        let prevLength = (previousValue.match(new RegExp(this.groupingSeparator, 'g')) || []).length;
        let newLength = (newValue.match(new RegExp(this.groupingSeparator, 'g')) || []).length;

        // Adjust the newCursorPosition to be between the same
        // digits when the number of commas changes
        if (prevLength > newLength) {
          newCursorPosition--;
        } else if (prevLength < newLength) {
          newCursorPosition++;
        }
      }

      if (input.selectionStart !== newCursorPosition) {
        input.selectionStart = newCursorPosition;
        input.selectionEnd = newCursorPosition;
      }
    }
  },

  _clamp(value, precision=0) {
    let pow = Math.pow(10, precision);
    return Math.min(Math.max(value, this.min * pow), this.max * pow);
  },

  _removeExtraDecimals(string = '') {
    let firstDecimal = string.indexOf(this.decimalSeparator);
    if (firstDecimal !== -1 && this.decimalSeparator !== '') {
      let firstHalf = string.slice(0, firstDecimal + 1);
      let secondHalf = string.slice(firstDecimal + 1);

      return `${firstHalf.replace(new RegExp(this.symbol, 'g'), '')}${secondHalf.replace(/[%.]/g, '')}`;
    }
    return string.replace(new RegExp(this.groupingSeparator.replace(/./, '\\.'), 'g'), '');
  },

  // Removes extra characters
  _applyPrecision(number) {
    let precision = this.maximumFractionDigits;
    let value = this._removeExtraDecimals(number);
    let decimalPlaces = 0;

    // Drops any characters beyond `precision` decimal points
    let decimalPointIndex = value.indexOf(this.decimalSeparator);
    if (decimalPointIndex !== -1 && this.decimalSeparator !== '') {
      decimalPlaces = value.slice(decimalPointIndex).length - 1;

      decimalPlaces = Math.min(decimalPlaces, precision);

      value = value.slice(0, decimalPointIndex + 1 + precision);
    }

    let separatorRegexp = new RegExp('[' + this.groupingSeparator + this.decimalSeparator + ']'.replace('.', '\\.'), 'g');
    let finalValue = this._clamp(parseInt(value.replace(separatorRegexp, ''), 10) * this.multiplier, decimalPlaces);

    if (isNaN(finalValue) || finalValue == null) {
      finalValue = null;
    } else {
      finalValue = finalValue / Math.pow(10, decimalPlaces);
    }

    return finalValue;
  },

  actions: {
    handleArrowKeys(evt) {
      if (evt.which === UP) {
        this._stepValue(this.step);
        return false;
      }
      if (evt.which === DOWN) {
        this._stepValue(this.step * - 1);
        return false;
      }
    },

    restrict(evt) {
      if (evt.which === 32) {
        return false;
      }

      if (evt.which <= 40 || evt.metaKey) {
        return true;
      }

      let numericInput = new RegExp('[\\d\\s' + this.symbol + this.groupingSeparator + this.decimalSeparator + '-]', 'g');
      return numericInput.test(String.fromCharCode(evt.which));
    },

    // Cleans the input before submitting the value to the `onchange` function
    reformat(evt) {
      let input = this.element.querySelector('input');
      let displayValue = input.value || '';
      if (evt.clipboardData) {
        return true;
      }

      this._setValue(displayValue);
    },

    focus() {
      set(this, 'isFocused', true);
    },

    blur() {
      set(this, 'isFocused', false);
      this._setValue(this._getValue());
    }
  }
});

