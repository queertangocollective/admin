import DS from 'ember-data';
import Model from './application';

const { attr, belongsTo } = DS;

export default Model.extend({
  event: belongsTo('event'),
  location: belongsTo('location'),
  extendedAddress: attr('string'),
  notes: attr('string')
});
