import Controller from '@ember/controller';
import sort from '../computed/sort';

export default Controller.extend({
  sortEventsBy: 'name',
  sortedEvents: sort('events', 'sortEventsBy'),
  sortTransactionsBy: 'paidBy.name',
  sortedTransactions: sort('transactions', 'sortTransactionsBy')
});
