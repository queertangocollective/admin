import DS from 'ember-data';
import Model from './application';

const { attr, belongsTo } = DS;

export default Model.extend({
  event: belongsTo('event'),
  person: belongsTo('person'),
  ticket: belongsTo('ticket'),
  purchase: belongsTo('transaction'),
  attended: attr('boolean'),
  role: attr('string'),
  level: attr('string'),
  notes: attr('string')
});
