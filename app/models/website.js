import DS from 'ember-data';
import Model from './application';

const { attr } = DS;

export default Model.extend({
  assets: attr(),
  sha: attr('string')
});
