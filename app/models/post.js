import DS from 'ember-data';
import Model from './application';

const { attr, hasMany } = DS;

export default Model.extend({
  title: attr('string'),
  body: attr('string'),
  slug: attr('string'),
  pinned: attr('boolean'),
  published: attr('boolean'),
  publishedAt: attr('date'),
  writtenBy: hasMany('author')
});
