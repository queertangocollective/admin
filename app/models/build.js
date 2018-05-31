import DS from 'ember-data';
import Model from './application';

const { attr, belongsTo } = DS;

export default Model.extend({
  deployedBy: belongsTo('person'),
  gitSha: attr('string'),
  gitUrl: attr('string'),
  notes: attr('string'),
  createdAt: attr('date'),
  live: attr('boolean'),
  liveAt: attr('date')
});
