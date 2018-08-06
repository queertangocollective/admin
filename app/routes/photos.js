import Collection from './collection';
import { inject as method } from 'ember-service-methods';

export default Collection.extend({
  uploadPhoto: method(),

  actions: {
    upload(file) {
      this.uploadPhoto(file).then(() => {
        this.refresh();
      });
    }
  }
});
