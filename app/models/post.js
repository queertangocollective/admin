import { computed, get } from '@ember/object';
import DS from 'ember-data';

const { attr, hasMany } = DS;

export default DS.Model.extend({
  title: attr('string'),
  body: attr('string'),
  slug: attr('string'),
  pinned: attr('boolean'),
  published: attr('boolean'),
  publishedAt: attr('date'),
  writtenBy: hasMany('author')
});
