import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  actions: {
    registerWith(parent, form) {
      form.set('parent', parent);
      parent.register(form);
    },
    ondelete(record, evt) {
      evt.preventDefault();
      this.ondelete(record);
    }
  }
}).reopenClass({
  positionalParams: ['fieldName']
});
