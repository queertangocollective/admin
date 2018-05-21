import DS from 'ember-data';
import Model from './application';

const { attr, belongsTo } = DS;

export default Model.extend({
  url: attr('string'),
  filesize: attr('number'),
  filename: attr('string'),
  width: attr('number'),
  height: attr('number'),
  tags: attr(),
  title: attr('string'),
  caption: attr('string'),
  post: belongsTo('post')
});
