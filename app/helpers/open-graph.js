import Helper from '@ember/component/helper';
import { A } from '@ember/array';
import EmberObject, { set, get } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';

const OpenGraph = EmberObject.extend({
  init(...args) {
    this._super(...args);
    set(this, 'items', A());
  },

  push(item) {
    let itemForId = this.items.findBy('id', item.id);
    let items = [...this.items];

    if (itemForId) {
      let index = this.items.indexOf(itemForId);
      items.splice(index, 1, item);
    } else {
      items.push(item);
    }

    set(this, 'items', A(items));
  },

  remove(id) {
    let item = this.items.findBy('id', id);
    let items = A([...this.items]);
    items.removeObject(item);
    set(this, 'items', A(items));
  }
});

export default Helper.extend({
  headData: service(),

  init(...args) {
    this._super(...args);
    let og = get(this, 'headData.openGraph');
    if (og == null) {
      og = OpenGraph.create();
      set(this, 'headData.openGraph', og);
    }
    og.push({ id: guidFor(this) });
  },

  compute([key, value]) {
    let og = get(this, 'headData.openGraph');
    og.push({ key, value, id: guidFor(this) });
    return '';
  },

  destroy() {
    get(this, 'headData.openGraph').remove(guidFor(this));
  }
});
