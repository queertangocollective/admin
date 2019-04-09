import { helper } from '@ember/component/helper';
import { camelize, capitalize } from '@ember/string';

export default helper(function ([string]) {
  return capitalize(camelize(string));
});
