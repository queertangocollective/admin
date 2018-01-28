import Router from '@ember/routing/router';
import config from './config/environment';

export default Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
}).map(function () {
  this.route('login');

  this.route('posts');
  this.route('post', { path: '/posts/:post_id' });

  this.route('events');
  this.route('event', { path: '/events/:event_id' }, function () {
    this.route('ledger');
    this.route('photos');
  });

  this.route('tickets');
  this.route('ticket', { path: '/tickets/:ticket_id' });

  this.route('ledger');
  this.route('transaction', { path: '/ledger/:transaction_id' });

  this.route('people');
  this.route('person', { path: '/people/:person_id' });

  this.route('locations');
  this.route('location', { path: '/locations/:location_id' });

  this.route('group', { path: '/groups/:group_id' });
});
