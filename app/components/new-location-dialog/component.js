import Component from '@ember/component';
import { set, get } from '@ember/object';
import { isBlank } from '@ember/utils';
import method from 'ember-service-methods/inject';

export default Component.extend({
  tagName: '',

  getLocationFromPostalCode: method(),

  actions: {
    submit(model, changes) {
      return get(this, 'onsubmit')(changes).then(get(this, 'dismiss'));
    },

    hydrateLocation({ changeset }) {
      if (!isBlank(get(changeset, 'postalCode'))) {
        this.getLocationFromPostalCode(get(changeset, 'postalCode')).then(function (data) {
          if (get(changeset, 'city') !== data.city ||
              get(changeset, 'regionCode') !== data.state) {
            set(changeset, 'city', data.city);
            set(changeset, 'regionCode', data.state);
          }
        }, function () {});
      }
    }
  }
});

