import Component from '@ember/component';
import { set, get, computed } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import { debounce } from '@ember/runloop';
import RSVP from 'rsvp';
import BufferedProxy from 'ember-buffered-proxy/proxy';
import layout from './template';

export default Component.extend({
  layout,

  tagName: 'form',

  classNames: ['form-for'],

  multiple: false,

  name: null,

  novalidate: true,

  autocomplete: true,

  attributeBindings: ['novalidate', 'autocomplete'],

  changeset: computed('model', {
    get() {
      return BufferedProxy.create({
        content: this.model || {}
      });
    }
  }),

  submit(evt) {
    if (evt) {
      evt.preventDefault();
      evt.stopPropagation();
    }

    let promises = [];
    let model = this.model;
    let changeset = this.changeset;
    let changes = this.changeset.buffer;
    let isDirty = changeset.get('hasChanges') || get(model, 'isDeleted') || model.constructor === Object || this.hasNestedChanges;

    if (isDirty && (model == null || get(model, 'isNew'))) {
      return this.onsubmit(model, changes).then(() => {
        return RSVP.all(this.nestedForms.map(function (form) {
          return form.submit(evt);
        }));
      }).then(() => {
        if (this.parent) {
          return this.parent.submit(evt);
        }
      });
    } else {
      promises = this.nestedForms.map(function (form) {
        return form.submit(evt);
      });
      if (isDirty) {
        promises.push(this.onsubmit(model, changes));
      }
    }

    return RSVP.all(promises);
  },

  save() {
    return this.submit().then(() => {
      this.onsaved && this.onsaved(this.model);
      this.notifyPropertyChange('changeset');
    });
  },

  init() {
    this._super(...arguments);
    set(this, 'nestedForms', []);
    set(this, 'nestedChanges', []);
    tryInvoke(this, 'oninit', [this]);
  },

  register(form) {
    this.nestedForms.push(form);
  },

  hasNestedChanges: computed(function () {
    return this.nestedForms.some((form) => form.changeset.hasChanges);
  }),

  actions: {
    save() {
      if (!this.model.get('isSaving')) {
        this.save();
      }
    },

    hasNestedChangesDidChange() {
      this.notifyPropertyChange('hasNestedChanges');
    },

    ondelete(record) {
      record.deleteRecord();
      tryInvoke(this, 'onchange', this.model, this.changeset.buffer);

      if (this.autosave) {
        debounce(this, 'save', 2000);
      }
    },

    onchange(model, field, value) {
      let [fieldName, ...path] = field.split('.');
      if (path.length) {
        let copy = Object.assign({}, get(model, fieldName));
        set(copy, path.join('.'), value);
        model.set(fieldName, copy);
      } else {
        model.set(field, value);
      }

      tryInvoke(this, 'onchange', this.model, this.changeset.buffer);

      if (this.autosave) {
        debounce(this, 'save', 2000);
      }
    }
  }
}).reopenClass({
  positionalParams: ['model']
});
