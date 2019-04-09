import { filter } from '@ember/object/computed';
import Helper from '@ember/component/helper';
import { isEqual, isPresent, isEmpty } from '@ember/utils';
import { defineProperty, observer, set, get } from '@ember/object';
import { isArray } from '@ember/array';

export default Helper.extend({
  compute([byPath, value, array]) {
    if (!isArray(array) && isArray(value)) {
      array = value;
      value = undefined;
    }

    set(this, 'array', array);
    set(this, 'byPath', byPath);
    set(this, 'value', value);

    return get(this, 'content');
  },

  byPathDidChange: observer('byPath', 'value', function() {
    let byPath = get(this, 'byPath');
    let value = get(this, 'value');

    if (isEmpty(byPath)) {
      defineProperty(this, 'content', []);
      return;
    }

    let filterFn;

    if (isPresent(value)) {
      filterFn = (item) => isEqual(get(item, byPath), value);
    } else {
      filterFn = (item) => !!get(item, byPath);
    }

    let cp = filter(`array.@each.${byPath}`, filterFn);

    defineProperty(this, 'content', cp);
  }),

  contentDidChange: observer('content', function() {
    this.recompute();
  })
});
