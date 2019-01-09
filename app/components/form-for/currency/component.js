import Component from '@ember/component';
import { dasherize } from '@ember/string';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import layout from './template';

export default Component.extend({
  layout,

  classNames: ['form-for_field'],

  intl: service(),

  hasLabel: true,

  min: Number.MIN_SAFE_INTEGER,

  max: Number.MAX_SAFE_INTEGER,

  inputId: computed('fieldName', 'model', 'index', {
    get() {
      return [
        this.modelName,
        this.index,
        dasherize(this.fieldName || '')
      ].compact().join('_');
    }
  }),

  modelName: computed('model', {
    get() {
      return get(this, 'model._content.constructor.modelName');
    }
  }),

  didRender() {
    this.set('currency', this.model.get(this.currencyName));
    if (this.currency == null) return;

    let test = Intl.NumberFormat(this.intl.locale, { style: 'currency', currency: this.currency }).format(9876543.21);

    let decimalSeparator = test.charAt(test.indexOf('21') - 1);
    if (decimalSeparator.match(/\d/)) {
      decimalSeparator = '';
    }

    let groupingSeparatorIndex = test.indexOf('3');
    while (test.charAt(groupingSeparatorIndex).match(/\d/)) {
      groupingSeparatorIndex--;
    }
  
    let groupingSeparator = test.charAt(groupingSeparatorIndex);

    this.set('symbol', test.replace(/\d/g, '')
               .replace(new RegExp('[' + decimalSeparator + ']', 'g'), '')
               .replace(new RegExp('[' + groupingSeparator + ']', 'g'), '').trim());
  },

  isSymbolBeforeNumber: computed('intl.locale', 'currency', 'symbol', function () {
    if (this.currency) {
      let test = Intl.NumberFormat(this.intl.locale, { style: 'currency', currency: this.currency }).format(9876543.21);
      if (test.indexOf(this.symbol) < 2) {
        return true;
      }
    }
    return false;
  }),

  displayCurrencies: computed('intl.locale', 'currencies', function () {
    return this.currencies.map((code) => {
      let test = Intl.NumberFormat(this.locale, { style: 'currency', currency: code }).format(0);
      return {
        symbol: test.replace(/[\d,.]+/g, '').trim(),
        code
      };
    });
  }),

  selectedCurrency: computed('displayCurrencies', 'currency', function () {
    return this.displayCurrencies.findBy('code', this.currency);
  }),

  actions: {
    setCurrency(model, fieldName, currency) {
      this.onchange(model, fieldName, currency.code);
    }
  }

}).reopenClass({
  positionalParams: ['fieldName', 'currencyName']
});
