import DS from 'ember-data';
import Model from './application';

const { attr } = DS;

export default Model.extend({
  name: attr('string'),
  locale: attr('string'),
  slug: attr('string')
});
