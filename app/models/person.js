import DS from 'ember-data';

const { attr, belongsTo, hasMany } = DS;

export default DS.Model.extend({
  name: attr('string'),
  email: attr('string'),
  biography: attr('string'),
  role: attr('string'),
  published: attr('boolean'),
  website: attr('string'),
  authorizations: hasMany('authorization')
});
