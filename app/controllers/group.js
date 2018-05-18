import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  currentHostname: computed({
    get() {
      return window.location.host;
    }
  })
});
