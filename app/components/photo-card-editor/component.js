import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import Ember from 'ember';

const {
  generateGuid
} = Ember;

export default Component.extend({
  photo: reads('payload.photo'),

  name: computed({
    get() {
      return generateGuid();
    }
  })
});
