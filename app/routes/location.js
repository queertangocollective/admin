import { set } from '@ember/object';
import { isBlank } from '@ember/utils';
import Resource from './resource';
import method from 'ember-service-methods/inject';

export default Resource.extend({

  getLocationFromPostalCode: method(),

  actions: {
    hydrateLocation({ changeset }) {
      if (!isBlank(changeset.postalCode)) {
        this.getLocationFromPostalCode(changeset.postalCode).then(function (data) {
          if (changeset.city !== data.city ||
              changeset.regionCode !== data.state) {
            set(changeset, 'city', data.city);
            set(changeset, 'regionCode', data.state);
          }
        }, function () {});
      }
    }
  }
});
