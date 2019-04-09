import Controller from '@ember/controller';
import { computed } from '@ember/object';
import moment from 'moment';

export default Controller.extend({
  year: computed(function () {
    return moment().format('YYYY');
  }),

  month: computed(function () {
    return moment().format('MM');
  })
});
