import Controller from '@ember/controller';
import { get, computed } from '@ember/object';

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
      console.log(get(this, 'model.locale'));
      return get(this, 'locales').findBy('code', get(this, 'model.locale'));
    },
    set(_, locale) {
      console.log(get(this, 'model.locale'));
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
