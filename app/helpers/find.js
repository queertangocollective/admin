import Helper from '@ember/component/helper';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Helper.extend({
  store: service(),

  compute([modelName, ids]) {
    return (ids || []).map((id) => {
      return get(this, 'store').peekRecord(modelName, id);
    });
  }
});
