import { set, computed } from '@ember/object';
import DS from 'ember-data';
import Model from './application';

const { attr, belongsTo } = DS;

export default Model.extend({
  photo: belongsTo('photo'),
  name: attr('string'),
  website: attr('string'),
  addressLine: attr('string'),
  extendedAddress: attr('string'),
  city: attr('string'),
  regionCode: attr('string'),
  postalCode: attr('string'),
  latitude: attr('string'),
  longitude: attr('string'),

  address: computed('addressLine', 'extendedAddress', {
    get() {
      return [this.addressLine, this.extendedAddress].compact().join('\n');
    },
    set(_, value) {
      let [addressLine, ...extendedAddress] = (value || '').split('\n');
      set(this, 'addressLine', addressLine);
      set(this, 'extendedAddress', extendedAddress.length ? extendedAddress.join('\n') : null);
      return value;
    }
  })
});
