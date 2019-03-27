import { helper } from '@ember/component/helper';
import { dasherize } from '@ember/string';

export default helper(function ([string]) {
  return dasherize((string || '').replace(/\./g, '-').replace(/\//g, '-'));
});
