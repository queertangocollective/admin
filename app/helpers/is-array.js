import { isArray } from '@ember/array';
import { helper } from '@ember/component/helper';

export default helper(function ([object]) {
  return isArray(object);
});
