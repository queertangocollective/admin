import Component from '@ember/component';
import { set, computed } from '@ember/object';
import layout from './template';

/**
  A `{{url-field}}` provides a .

  ```htmlbars
  {{url-field value=value onchange=(action (mut value))}}
  ```

  @public
  @class UrlField
  @extends Ember.Component
 */
export default Component.extend({
  layout,
  classNames: ['url-field'],
  classNameBindings: ['hasSecure'],

  /**
    If the url is secure (https)

    @property isSecure
    @type Boolean
    @default true
  */
  isSecure: computed('value', {
    get() {
      return (this.value || '').indexOf('https:') === 0;
    },
    set() {
      let url = this.value;
      if (url != null) {
        if (url.match(/^http(s)?:/) == null) {
          url = 'http://' + url;
        } else if (url.indexOf('http:') === 0) {
          url = url.replace(/^(http:)/, 'https:');
        } else {
          url = url.replace(/^(https:)/, 'http:');
        }
      }
      set(this, 'value', url);
      return (url || '').indexOf('https') === 0;
    }
  }),


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
  disabled: false
});
