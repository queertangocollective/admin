import DS from 'ember-data';

const { attr, hasMany } = DS;

export default DS.Model.extend({
  description: attr('string'),
  sku: attr('string'),
  cost: attr('number'),
  quantity: attr('number'),
  currency: attr('string'),
  validFrom: attr('date'),
  validTo: attr('date')
});
