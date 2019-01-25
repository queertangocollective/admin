import Model from './application';
import { belongsTo, hasMany } from 'ember-data/relationships';
import attr from 'ember-data/attr';
import { bool } from '@ember/object/computed';

export default Model.extend({
  title: attr('string'),
  body: attr('string'),
  slug: attr('string'),
  pinned: attr('boolean'),
  writtenBy: hasMany('person'),
  channel: belongsTo('channel'),
  publishedPosts: hasMany('published-post'),
  isPublished: bool('publishedPosts.length')
});
