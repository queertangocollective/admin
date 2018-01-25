import DS from 'ember-data';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  event: belongsTo('event'),
  person: belongsTo('person'),
  role: attr('string')
});
