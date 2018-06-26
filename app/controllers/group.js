import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  timezones: computed(function () {
    return [
      'America/New_York',
      'Pacific/Honolulu',
      'Europe/Berlin',

    ];
  })

});
