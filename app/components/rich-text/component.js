import Component from '@ember/component';
import { get, computed } from '@ember/object';

export default Component.extend({
  tagName: '',
  mobiledoc: computed('value', {
    get() {
      return JSON.parse(get(this, 'value'));
    }
  })
}).reopenClass({
  positionalParams: ['value']
});
