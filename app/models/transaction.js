import DS from 'ember-data';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  description: attr('string'),
  paidAt: attr('date'),
  paidBy: attr('string'),
  receipt: belongsTo('photo'),
  amountPaid: attr('number'),
  amountOwed: attr('number'),
  currency: attr('string'),
  paymentMethod: attr('string'),
  paymentProcesssorUrl: attr('string'),
  notes: attr('string'),
  ticket: belongsTo('ticket')
});
