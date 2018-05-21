import DS from 'ember-data';
import Model from './application';

const { attr, belongsTo, hasMany } = DS;

export default Model.extend({
  name: attr('string'),
  apiKey: attr('string'),
  builds: hasMany('build'),
  currentBuild: belongsTo('build'),
  email: attr('string'),
  hostname: attr('string'),
  timezone: attr('string'),
  locale: attr('string')
});
