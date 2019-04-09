import { isBlank } from '@ember/utils';
import Component from '@ember/component';
import { set } from '@ember/object';
import { cancel, debounce } from '@ember/runloop';
import layout from './template';
import RSVP from 'rsvp';
import opacity from 'ember-animated/motions/opacity';

/**
  A `{{search-field}}` is a drop in replacement
  for `<input type="search">`.

  The simplest `{{search-field}}` would be:

  ```htmlbars
  {{search-field query=q onquery=(action (mut q))}}
  ```

  @public
  @class SearchField
  @extends Ember.Component
 */
export default Component.extend({
  layout,
  tagName: '',

  /**
    The icon to display to the right hand side

    @property icon
    @type string
    @default 'search'
  */
  icon: 'search',

  /**
    Called whenever the user changes the value.

    @event onquery
    @param {String} value The string
   */

  /**
    The `name` property of the `input` element.

    @property name
    @type String
    @default null
   */
  name: null,

  /**
    Whether or not the field is disabled.

    @property disabled
    @type Boolean
    @default false
   */
  disabled: false,

  didReceiveAttrs() {
    if (this._timer == null) {
      set(this, 'value', this.query);
    }
  },

  clear() {
    set(this, 'value', null);
    this.query = null;
    cancel(this._timer);
    this._timer = null;
    this.onquery('');
    if (this.onchange) {
      this.onchange('');
    }
  },

  search() {
    this._timer = null;
    this.onquery(this.value);
  },

  duration: 250,

  fade: function* ({ insertedSprites, removedSprites }) {
    yield RSVP.all([
        ...insertedSprites.map(opacity),
        ...removedSprites.map(opacity)
    ]);
  },

  actions: {
    change(value) {
      if (isBlank(value) || value == null) {
        this.clear();
      } else if (value !== this.value) {
        set(this, 'value', value);
        this._timer = debounce(this, 'search', 500);
      }
      if (this.onchange) {
        this.onchange(value);
      }
    }
  }
});
