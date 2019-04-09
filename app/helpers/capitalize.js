import { helper } from '@ember/component/helper';
import { capitalize, dasherize } from '@ember/string';

export default helper(function ([string]) {
  let name = string || '';
  name = name.split('.').slice(-2).join('-');
  return dasherize(name).split('-').map(capitalize).join(' ');
});
