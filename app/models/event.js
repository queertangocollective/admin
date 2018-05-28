import DS from 'ember-data';
import Model from './application';

const { attr, belongsTo, hasMany } = DS;

export default Model.extend({
  title: attr('string'),
  description: attr('string'),
  venue: belongsTo('venue'),
  startsAt: attr('date'),
  endsAt: attr('date'),
  level: attr('string'),
  guests: hasMany('guest'),
  ticketedEvents: hasMany('ticketed-event'),
  ticketStubs: hasMany('ticket-stubs')
});
