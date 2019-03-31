import Model from './application';
import { belongsTo } from 'ember-data/relationships';
import attr from 'ember-data/attr';

export default Model.extend({
  title: attr('string'),
  body: attr('string'),
  slug: attr('string'),
  featured: attr('boolean'),
  live: attr('boolean'),
  post: belongsTo('post'),
  publishedBy: belongsTo('person'),
  publishedAt: attr('date'),
  channel: belongsTo('channel')
});
