import DS from 'ember-data';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  event: belongsTo('event'),
  location: belongsTo('location'),
  extendedAddress: attr('string'),
  notes: attr('string')
});
