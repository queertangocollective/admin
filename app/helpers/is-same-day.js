import { helper } from '@ember/component/helper';
import moment from 'moment';

export default helper(function ([lhs, rhs]) {
  return moment(lhs).isSame(rhs, 'day');
});
