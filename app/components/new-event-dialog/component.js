import Component from '@ember/component';
import { get } from '@ember/object';
import { all } from 'rsvp';
import moment from 'moment';

export default Component.extend({
  classNames: ['new-event-dialog'],

  actions: {
    submit(model, changes) {
      if (this.repeats) {
        let repetition = this.repetition;
        let frequency = this.frequency;
        let events = [changes];
        while (--repetition) {
          let event = events[events.length - 1];
          events.push({
            title: event.title,
            startsAt: moment(event.startsAt).add(1, frequency).toDate(),
            endsAt: moment(event.endsAt).add(1, frequency).toDate()
          });
        }

        return all(events.map(event => this.onsubmit(event))).then(this.dismiss);
      }
      return this.onsubmit(changes).then(this.dismiss);
    }
  }
});
