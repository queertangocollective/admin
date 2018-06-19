import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  classNames: ['event-planner'],

  init() {
    this._super(...arguments);
    this.set('center', new Date());
  },

  eventsByDay: computed('events.@each.{endsAt,startsAt}', 'center', function () {
    let center = moment(this.center);
    let start = moment(center).startOf('month');
    let end = moment(center).endOf('month');

    let thisMonthsEvents = this.events.filter((event) => {
      return moment(event.endsAt).isAfter(start) && moment(event.startsAt).isBefore(end);
    });

    let eventsByDay = {};
    let month = center.month();
    for (let i = start.date(), len = end.date(); i < len; i++) {
      eventsByDay[i] = thisMonthsEvents.filter((event) => {
        return (event.startsAt.getMonth() === month &&
                event.startsAt.getDate() === i) ||
               (event.endsAt.getMonth() === month &&
                event.endsAt.getDate() === i);
      });
    }
    return eventsByDay;
  })
});
