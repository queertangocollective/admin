import Component from '@ember/component';
import { get } from '@ember/object';
import { all } from 'rsvp';
import moment from 'moment';

export default Component.extend({
  classNames: ['new-event-dialog'],

  actions: {
    submit(model, changes) {
      if (get(this, 'repeats')) {
        let repetition = get(this, 'repetition');
        let frequency = get(this, 'frequency');
        let events = [changes];
        while (--repetition) {
          let event = events[events.length - 1];
          events.push({
            title: event.title,
            startsAt: moment(event.startsAt).add(1, frequency).toDate(),
            endsAt: moment(event.endsAt).add(1, frequency).toDate()
          });
        }

        return all(events.map(event => get(this, 'onsubmit')(event))).then(get(this, 'dismiss'));
      }
      return get(this, 'onsubmit')(changes).then(get(this, 'dismiss'));
    }
  }
});
