import Model from './application';
import { belongsTo } from 'ember-data/relationships';
import attr from 'ember-data/attr';

export default Model.extend({
  title: attr('string'),
  body: attr('string'),
  slug: attr('string'),
  featured: attr('boolean'),
  post: belongsTo('post'),
  publishedBy: belongsTo('person'),
  channel: belongsTo('channel')
});
