import DS from 'ember-data';
import Model from './application';

const { belongsTo } = DS;

export default Model.extend({
  person: belongsTo('person'),
  post: belongsTo('post')
});
