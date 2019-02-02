import Model from './application';
import { belongsTo, hasMany } from 'ember-data/relationships';
import attr from 'ember-data/attr';
import { computed } from '@ember/object';
import { bool, reads } from '@ember/object/computed';

export default Model.extend({
  title: attr('string'),
  body: attr('string'),
  slug: attr('string'),
  pinned: attr('boolean'),
  writtenBy: hasMany('person'),
  channel: belongsTo('channel'),
  publishedPosts: hasMany('published-post'),
  livePost: computed('publishedPosts.@each.live', function () {
    return this.publishedPosts.find(post => post.live);
  }),
  isPublished: bool('livePost'),
  publishedAt: reads('livePost.createdAt')
});
