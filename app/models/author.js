import DS from 'ember-data';

const { belongsTo } = DS;

export default DS.Model.extend({
  person: belongsTo('person'),
  post: belongsTo('post')
});
