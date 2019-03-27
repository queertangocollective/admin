import { helper } from '@ember/component/helper';
import moment from 'moment';

function time(t) {
  if (t.format('mm') === '00') {
    return t.format('h');
  } else {
    return t.format('h:mm');
  }
}

function formatTime(s, e, timezone) {
  let startsAt = moment.tz(s, timezone);
  let endsAt = moment.tz(e, timezone);

  if (startsAt.format('A') === endsAt.format('A')) {
    return `${time(startsAt)} - ${time(endsAt)}${endsAt.format('a')}`;
  } else {
    return `${time(startsAt)}${startsAt.format('a')} - ${time(endsAt)}${endsAt.format('a')}`;
  }
}

export function formatDateRange(startDate, endDate, timezone) {
  if (moment.tz(startDate, timezone).isSame(moment.tz(endDate, timezone), 'day')) {
    return moment.tz(startDate, timezone).format('MMMM D, YYYY') + ' ' + formatTime(startDate, endDate, timezone);
  } else if (moment.tz(startDate, timezone).isSame(moment.tz(endDate, timezone), 'month')) {
    return `${moment.tz(startDate, timezone).format("MMMM D h:mma")} - ${moment.tz(endDate, timezone).format('D, YYYY h:mma')}`;
  } else {
    return `${moment.tz(startDate, timezone).format("MMMM D, YYYY h:mma")} - ${moment.tz(endDate, timezone).format('MMMM D, YYYY h:mma')}`;
  }
}

export default helper(function ([startDate, endDate], hash) {
  return formatDateRange(startDate, endDate, hash.timezone);
});
