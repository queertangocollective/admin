import DS from 'ember-data';
import Model from './application';

const { belongsTo, attr } = DS;

export default Model.extend({
  deployedBy: belongsTo('person'),
  sha: attr('string'),
  notes: attr('string'),
  createdAt: attr('date'),
  liveAt: attr('date')
});
