import { helper } from '@ember/component/helper';

export default helper(function (list) {
  list = list.slice();
  list.toString = function () {};
  return list;
});
