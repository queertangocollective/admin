import Component from '@ember/component';
import moment from 'moment';

export default Component.extend({
  tagName: '',
  months: moment.months(),
  years: [...new Array(moment().year() - 2017)].map((_, i) => i + 2018),
  jumpTo(unit, calendar, value) {
    let newCenter = calendar.center.clone()[unit](value);
    calendar.actions.changeCenter(newCenter);
  }
});
