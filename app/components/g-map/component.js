import Component from '@ember/component';
import config from '../../config/environment';

export default Component.extend({
  classNames: ['google-map'],
  apiKey: config.GOOGLE_MAPS_API_KEY
});
