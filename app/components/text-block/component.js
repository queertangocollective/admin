import Component from '@ember/component';

export default Component.extend({
  classNames: ['text-block']
}).reopenClass({
  positionalParams: ['text']
});