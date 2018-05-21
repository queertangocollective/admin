import DS from 'ember-data';
import Model from './application';

const { attr, belongsTo } = DS;

export default Model.extend({
  event: belongsTo('event'),
  person: belongsTo('person'),
  role: attr('string')
});
