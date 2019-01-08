import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { all, resolve } from 'rsvp';
import moment from 'moment';

const Guest = EmberObject.extend({
  isDeleted: false,

  toJSON() {
    return { 
      person: this.person,
      role: this.role
    };
  },

  deleteRecord() {
    this.set('isDeleted', true);
  }
});

export default Component.extend({
  classNames: ['new-event-dialog'],

  store: service(),

  form: computed(function () {
    return {
      guests: [Guest.create()]
    }
  }),

  repetitions: computed(function () {
    return [{
      label: 'weekly',
      value: 'week'
    }, {
      label: 'monthly',
      value: 'month'
    }, {
      label: 'daily',
      value: 'day'
    }]
  }),

  actions: {
    removeByline(changes, byline) {
      changes.get('guests').removeObject(byline);
    },
    addByline(changes, evt) {
      evt.preventDefault();
      changes.get('guests').pushObject(Guest.create());
    },
    submitBylines(model, changes) {
      model.setProperties(changes);
      return resolve();
    },
    submit(model, changes) {
      if (this.repeats) {
        let frequency = this.frequency.value;
        let finalDate = moment(this.repeatsUntil).endOf('day');

        let startsAt = moment(changes.startsAt);
        let endsAt = moment(changes.endsAt);
        let events = [];
        while (startsAt.isSameOrBefore(finalDate)) {
          events.push({
            title: changes.title,
            description: changes.description,
            startsAt: startsAt.toDate(),
            endsAt: endsAt.toDate(),
            venue: Object.assign({}, changes.venue),
            guests: model.guests.map(guest => guest.toJSON())
          });
          startsAt = startsAt.add(1, frequency);
          endsAt = endsAt.add(1, frequency);
        }

        return all(events.map(event => this.onsubmit(event))).then(this.dismiss);
      }
      return this.onsubmit(changes).then(this.dismiss);
    }
  }
});
