import DS from 'ember-data';
import { computed } from '@ember/object';
import Model from './application';

const { attr, belongsTo, hasMany } = DS;

export default Model.extend({
  appleDeveloperMerchantidDomainAssociation: attr('string'),
  name: attr('string'),
  apiKey: attr('string'),
  builds: hasMany('build'),
  currentBuild: belongsTo('build'),
  websites: hasMany('website'),
  currentWebsite: belongsTo('website'),
  email: attr('string'),
  hostname: attr('string'),
  timezone: attr('string'),
  locale: attr('string'),
  glitchUrl: attr('string'),
  stripePublishableKey: attr('string'),
  stripeSecretKey: attr('string'),
  channels: hasMany('channel'),

  url: computed('hostname', function() {
    if (this.hostname.indexOf('localhost') === 0) {
      return `http://${this.hostname}`;
    } else {
      return `https://${this.hostname}`;
    }
  })
});
