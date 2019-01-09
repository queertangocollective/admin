import Component from '@ember/component';
import { dasherize } from '@ember/string';
import { get, computed } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import layout from './template';

export default Component.extend({
  layout,

  hasLabel: true,

  classNames: ['form-for_field'],

  classNameBindings: ['autocomplete:has-autocompletion'],

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

  actions: {
    query(...args) {
      return tryInvoke(this, 'onquery', args);
    },

    autocomplete(model, key, value, evt) {
      this.onchange(model, key, value);
      evt.preventDefault();
      return false;
    }
  }
}).reopenClass({
  positionalParams: ['fieldName']
});
