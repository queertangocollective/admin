import DS from 'ember-data';
import Model from './application';

const { belongsTo } = DS;

export default Model.extend({
  event: belongsTo('event'),
  ticket: belongsTo('ticket')
});
