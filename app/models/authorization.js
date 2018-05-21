import DS from 'ember-data';
import Model from './application';

const { attr, belongsTo } = DS;

export default Model.extend({
  person: belongsTo('person'),
  group: belongsTo('group'),
  email: attr('string'),
  avatar: attr('string'),
  currentSignInAt: attr('string'),
  lastSignInAt: attr('string'),
  provider: attr('string')
});
