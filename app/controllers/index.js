import Controller from '@ember/controller';
import sort from '../computed/sort';

export default Controller.extend({
  sortEventsBy: 'name',
  sortedEvents: sort('events', 'sortEventsBy'),
  sortTransactionsBy: 'person.name',
  sortedTransactions: sort('transactions', 'sortTransactionsBy')
});
