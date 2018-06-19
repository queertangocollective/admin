import Model from './application';
import { belongsTo, hasMany } from 'ember-data/relationships';
import attr from 'ember-data/attr';

export default Model.extend({
  title: attr('string'),
  body: attr('string'),
  slug: attr('string'),
  pinned: attr('boolean'),
  published: attr('boolean'),
  publishedAt: attr('date'),
  writtenBy: hasMany('person'),
  channel: belongsTo('channel')
});
