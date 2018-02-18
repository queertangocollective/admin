import Controller from '@ember/controller';
import { get, set, computed } from '@ember/object';

export default Controller.extend({
  locales: [{
    label: '🇺🇸 English',
    code: 'en-US'
  }, {
    label: '🇦🇷 Spanish',
    code: 'es-AR'
  }],

  locale: computed('model.locale', {
    get() {
      return get(this, 'locales').findBy('code', get(this, 'model.locale'));
    },
    set(_, locale) {
      set(this, 'model.locale', locale.code);
      return locale;
    }
  }),

  currentHostname: computed({
    get() {
      return window.location.host;
    }
  })
});
