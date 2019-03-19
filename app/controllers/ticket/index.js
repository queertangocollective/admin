import Controller from '@ember/controller';
import sort from '../../computed/sort';

export default Controller.extend({
  sortEventsBy: '-starts-at',
  events: sort('model.events', 'sortEventsBy'),
});
