import { bind } from '@ember/runloop';
import { defer, resolve } from 'rsvp';
import { assign } from '@ember/polyfills';
import Service from '@ember/service';
import { set, get } from '@ember/object';
import { task } from 'ember-concurrency';

/**
  Example:

  ```js
  export default Ember.Route.extend({
    flash: service(),

    deleteItem: task(function * (item) {
      try {
        item.deleteRecord();
        yield this.flash('Deleting Item', {
          timeout: 5000
        });
      } catch {
        item.rollback();
      } finally {
        item.save();
      }
    })
  });
  ```
*/
export default Service.extend({
  message: null,

  _notify: task(function * (text, options) {
    let message = assign({
      text,
    }, options, defer());

    try {
      set(this, 'message', message);

      if (options.timeout) {
        // Race promises; this uses setTimeout instead
        // of Ember.run.later so we can test undo / dismiss.
        // If we didn't do this, tests would pause until
        // the action completed on its own
        this._timer = setTimeout(
          bind(null, message.resolve),
          options.timeout
        );
      }

      yield message.promise;
    } finally {
      set(this, 'message', null);
      clearTimeout(this._timer);
      this._timer = null;
    }
  }),

  execute(text, options={}) {
    // Resolve any messages being shown
    if (get(this, 'message')) {
      get(this, 'message.resolve')();
    }

    return resolve().then(() => {
      return get(this, '_notify').perform(text, options);
    });
  }
});
