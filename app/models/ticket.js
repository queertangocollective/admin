import DS from 'ember-data';
import Model from './application';
import { computed } from '@ember/object';
import moment from 'moment';

const { attr, hasMany } = DS;

export default Model.extend({
  description: attr('string'),
  sku: attr('string'),
  cost: attr('number'),
  quantity: attr('number'),
  currency: attr('string'),
  validFrom: attr('date'),
  validTo: attr('date'),
  ticketedEvents: hasMany('ticketed-event'),
  ticketStubs: hasMany('ticket-stubs'),
  events: computed('ticketedEvents.@each.events', function () {
    return this.get('ticketedEvents').mapBy('event');
  }),
  isActive: computed('validFrom', 'validTo', function () {
    return moment().isAfter(this.validFrom) &&
           moment().isBefore(this.validTo);
  })
});
