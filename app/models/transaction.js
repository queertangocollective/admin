import DS from 'ember-data';
import Model from './application';

const { attr, belongsTo } = DS;

export default Model.extend({
  description: attr('string'),
  paidAt: attr('date'),
  paidBy: belongsTo('person'),
  receipt: belongsTo('photo'),
  amountPaid: attr('number'),
  amountOwed: attr('number'),
  currency: attr('string'),
  paymentMethod: attr('string'),
  paymentProcessorUrl: attr('string'),
  notes: attr('string'),
  ticket: belongsTo('ticket')
});
