import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { all, resolve } from 'rsvp';

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
  classNames: ['edit-event-dialog'],

  store: service(),

  form: computed('events', async function () {
    let [title, ...otherTitles] = this.events.mapBy('title').uniq();
    if (otherTitles.length > 0) {
      title = null;
    }
    let [description, ...otherDescriptions] = this.events.mapBy('description').uniq();
    if (otherDescriptions.length > 0) {
      description = null;
    }

    let startTime = this.events[0].startsAt;
    let endTime = this.events[0].endsAt;
    let isSameTime = (firstTime, secondTime) => {
      return moment(firstTime).format('HH:mm') === moment(secondTime).format('HH:mm');
    };

    if (this.events.some(event => !isSameTime(startTime, event.startsAt))) {
      startTime = null;
    }
    if (this.events.some(event => !isSameTime(endTime, event.endsAt))) {
      endTime = null;
    }

    let venues = await all(this.events.mapBy('venue'));
    let locations = await all(venues.mapBy('location'));
    let [location, ...otherLocations] = locations.uniq();
    if (otherLocations.length > 0) {
      location = null;
    } 

    let [extendedAddress, ...otherAddresses] = venues.mapBy('extendedAddress').uniq();
    if (otherAddresses.length > 0) {
      extendedAddress = null;
    }

    let guests = {};
    let counter = {};

    let eventBylines = await all(this.events.mapBy('guests'));
    for (let i = 0, len = eventBylines.length; i < len; i++) {
      let bylines = eventBylines[i];
      for (let j = 0, jLen = bylines.length; j < jLen; j++) {
        let byline = bylines.objectAt(j);
        let person = await byline.person;
        counter[person.id] = (counter[person.id] || 0) + 1;
        guests[person.id] = Guest.create({
          role: byline.role,
          person
        });
      }
    }

    let commonGuests = [];
    Object.keys(counter).forEach(id => {
      if (counter[id] === this.events.length) {
        commonGuests.push(guests[id]);
      }
    })

    return {
      title, 
      description,
      startTime,
      endTime,
      venue: {
        location,
        extendedAddress
      },
      guests: commonGuests
    };
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
      // edit all events
    }
  }
});
