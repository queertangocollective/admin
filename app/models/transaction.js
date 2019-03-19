import DS from 'ember-data';
import Model from './application';

const { attr, belongsTo, hasMany } = DS;

export default Model.extend({
  description: attr('string'),
  paidAt: attr('date'),
  paidBy: belongsTo('person'),
  receipt: belongsTo('photo'),
  ticket: belongsTo('ticket'),
  amountPaid: attr('number'),
  amountOwed: attr('number'),
  currency: attr('string'),
  paymentMethod: attr('string'),
  paymentProcessorUrl: attr('string'),
  notes: attr('string'),
  ticketStubs: hasMany('ticket-stub')
});
