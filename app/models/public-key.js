import DS from 'ember-data';
import Model from './application';

const { attr, belongsTo } = DS;

export default Model.extend({
  name: attr('string'),
  person: belongsTo('person'),
  fingerprint: attr('string'),
  lastUsedAt: attr('date'),
  key: attr('string')
});
