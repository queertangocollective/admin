import DS from 'ember-data';

const { belongsTo, attr } = DS;

export default DS.Model.extend({
  deployedBy: belongsTo('person'),
  sha: attr('string'),
  notes: attr('string'),
  createdAt: attr('date'),
  liveAt: attr('date')
});
