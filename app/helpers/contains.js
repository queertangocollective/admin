import { helper } from '@ember/component/helper';

export default helper(function ([haystack, needle]) {
  return (haystack || []).indexOf(needle) !== -1;
});