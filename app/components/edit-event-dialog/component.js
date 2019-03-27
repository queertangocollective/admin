import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { all } from 'rsvp';
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
      return moment.tz(firstTime, this.timezone).format('HH:mm') ===
        moment.tz(secondTime, this.timezone).format('HH:mm');
    };

    if (this.events.some(event => !isSameTime(startTime, event.startsAt))) {
      startTime = null;
    }
    if (this.events.some(event => !isSameTime(endTime, event.endsAt))) {
      endTime = null;
    }

    let venues = await all(this.events.mapBy('venue'));
    venues = venues.map(venue => venue || {});
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
          person,
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
    addByline(changes, evt) {
      evt.preventDefault();
      changes.get('guests').pushObject(Guest.create({ isNew: true }));
    },
    submit(model, changes) {
      if (model instanceof Guest) {
        return all(this.events.map(async (event) => {
          if (model.isSaved) {
            return;
          } else if (model.isDeleted) {
            let bylines = await event.guests;
  
            let guest;
            for (let i = 0, len = bylines.length; i < len; i++) {
              let byline = bylines.objectAt(i);
              let person = await byline.person;
              if (byline.role === model.role &&
                  person === model.person) {
                guest = byline;
                break;
              }
            }
            if (guest) {
              guest.deleteRecord();
              return guest.save();
            }
          } else if (model.isNew) {
            let guest = this.store.createRecord('guest', {
              event,
              role: changes.role,
              person: changes.person
            });
            return guest.save();
          } else {
            let bylines = await event.guests;
  
            let guest;
            for (let i = 0, len = bylines.length; i < len; i++) {
              let byline = bylines.objectAt(i);
              let person = await byline.person;
              if (byline.role === model.role &&
                  person === model.person) {
                guest = byline;
                break;
              }
            }
            if (guest) {
              if (changes.person) {
                guest.set('person', changes.person);
              }
              if (changes.role) {
                guest.set('role', changes.role);
              }
              return guest.save();
            }
          }
        })).then(() => {
          model.setProperties(changes);
        });
      }

      if (changes.title) {
        this.events.setEach('title', changes.title);
      }

      if (changes.description) {
        this.events.setEach('description', changes.description);
      }

      if (changes.startTime) {
        this.events.forEach(event => {
          let startsAt = moment.tz(event.startsAt, this.timezone);
          let time = moment.tz(changes.startTime, this.timezone);
          startsAt.hours(time.hours());
          startsAt.minutes(time.minutes());
          event.set('startsAt', startsAt.toDate());
        })
      }

      if (changes.endTime) {
        this.events.forEach(event => {
          let endsAt = moment.tz(event.endsAt, this.timezone);
          let time = moment.tz(changes.endTime, this.timezone);
          endsAt.hours(time.hours());
          endsAt.minutes(time.minutes());
          event.set('endsAt', endsAt.toDate());
        })
      }
      
      if (changes.venue) {
        return all(this.events.map(async (event) => {
          let venue = await event.venue;
          if (venue == null) {
            venue = this.store.createRecord('venue', {
              location: changes.venue.location,
              extendedAddress: changes.venue.extendedAddress
            });
            event.set('venue', venue);
          } else {
            if (changes.venue.location !== venue.location) {
              venue.set('location', changes.venue.location);
            }
    
            if (changes.venue.extendedAddress !== venue.extendedAddress) {
              venue.set('extendedAddress', changes.venue.extendedAddress);
            }
          }
          await venue.save();
          await event.save();
        }));
      }

      return all(this.events.map(event => event.save()));
    }
  }
});
