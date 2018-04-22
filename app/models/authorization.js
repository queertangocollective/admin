import DS from 'ember-data';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  person: belongsTo('person'),
  group: belongsTo('group'),
  email: attr('string'),
  avatar: attr('string'),
  currentSignInAt: attr('string'),
  lastSignInAt: attr('string'),
  provider: attr('string')
});
