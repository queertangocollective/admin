import { set } from '@ember/object';
import Resource from '../../routes/resource';

export default Resource.extend({
  actions: {
    publish(model) {
      set(model, 'published', true);
      return model.save();
    },
    unpublish(model) {
      set(model, 'published', false);
      return model.save();
    }
  }
});
