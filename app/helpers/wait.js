import { helper } from '@ember/component/helper';

import { later } from '@ember/runloop';
import { isPresent } from '@ember/utils';
import { defer } from 'rsvp';
import moment from 'moment';

export function wait(duration) {
  if (duration === 'forever') {
    let { promise } = defer();
    return promise;
  }

  let [number, units] = duration.split(/([0-9.]+)/).map((string) => string.trim()).filter(isPresent);
  let { promise, resolve } = defer();
  later(this, resolve, moment.duration(parseFloat(number, 10), units).asMilliseconds());
  return promise;
}

/**
  `wait` returns a promise that will resolve after a specified
  amount of time, or never.
  ```hbs
  {{#action-button action=(wait 'forever')}}
    Build me a spaceship
  {{/action-button}}
  {{#action-button action=(wait '10s')}}
    Blow a bubble
  {{/action-button}}
  ```
  @public
  @method wait
  @param {String} duration The duration as a string
  @return {Promise} A promise that will resolve in the given amount of time provided
  @for Helpers
*/
export default helper(function ([duration]) {
  return function () {
    return wait(duration);
  };
});
