import { helper } from '@ember/component/helper';

export default helper(function (params) {
  return params.reduce(function (result, param) {
    return result || param;
  });
});
