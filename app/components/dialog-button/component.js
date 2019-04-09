import Component from '@ember/component';
import { inject as method } from 'ember-service-methods';
import layout from './template';

export default Component.extend({
  layout,
  tagName: '',
  open: method(),
  type: 'submit',
  actions: {
    open(Dialog) {
      return this.open(Dialog, this.group).then((...args) => {
        return this.onsubmit(...args);
      }).catch(() => {});
    }
  }
}).reopenClass({
  positionalParams: ['dialog']
});
