import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
  classNames: ['event-planner'],
  center: reads('events.firstObject.startsAt'),
  hours: computed({
    get() {
      let hours = [];
      for (let i = 0; i <= 24; i++) {
        let hour = (i % 12) || 12;
        if (i >= 12) {
          hours.push(`${hour}pm`);
        } else {
          hours.push(`${hour}am`);
        }
      }
      return hours;
    }
  })
});
