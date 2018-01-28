import DS from 'ember-data';

const { attr, belongsTo, hasMany } = DS;

export default DS.Model.extend({
  name: attr('string'),
  apiKey: attr('string'),
  builds: hasMany('build'),
  currentBuild: belongsTo('build'),
  email: attr('string'),
  hostname: attr('string'),
  timezone: attr('string'),
  locale: attr('string')
});
