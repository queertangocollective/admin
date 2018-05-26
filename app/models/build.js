import DS from 'ember-data';
import Model from './application';

const { attr } = DS;

export default Model.extend({
  deployedBy: attr('string'),
  gitSha: attr('string'),
  gitUrl: attr('string'),
  notes: attr('string'),
  createdAt: attr('date'),
  live: attr('boolean'),
  liveAt: attr('date')
});
