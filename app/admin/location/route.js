import { set, get } from '@ember/object';
import { isBlank } from '@ember/utils';
import Resource from '../../routes/resource';
import method from 'ember-service-methods/inject';

export default Resource.extend({

  getLocationFromPostalCode: method(),

  actions: {
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
