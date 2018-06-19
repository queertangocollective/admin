import Controller from '@ember/controller';
import sort from '../../computed/sort';

export default Controller.extend({
  sortEventsBy: '-startsAt',
  events: sort('model.events', 'sortEventsBy')
});
