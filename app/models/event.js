import { get } from '@ember/object';
import { isPresent } from '@ember/utils';
import DS from 'ember-data';
import moment from 'moment';

const { attr, belongsTo, hasMany } = DS;

export default DS.Model.extend({
  title: attr('string'),
  description: attr('string'),
  venue: belongsTo('venue'),
  startsAt: attr('date'),
  endsAt: attr('date'),
  level: attr('string'),
  guests: hasMany('guest')
});
