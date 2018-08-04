import { computed } from '@ember/object';
import { camelize } from '@ember/string';

export default function (collectionPath, sortPath) {
  return computed(collectionPath + '.[]', collectionPath + '.isLoaded', sortPath, function () {
    let sort = this.get(sortPath);
    if (sort == null) {
      return this.get(collectionPath);
    }
    if (sort.indexOf('-') === 0) {
      return this.get(collectionPath).sortBy(camelize(sort.slice(1)) + ':desc');
    }
    return this.get(collectionPath).sortBy(camelize(sort));
  });
}
