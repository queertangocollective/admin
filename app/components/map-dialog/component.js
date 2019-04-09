import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  classNames: ['map-dialog'],
  zoom: 15
});