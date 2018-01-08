import Ember from 'ember';

const { computed, get } = Ember;

export default Ember.Controller.extend({
  locales: [{
    label: '🇺🇸 English',
    code: 'en-US'
  }, {
    label: '🇦🇷 Spanish',
    code: 'es-AR'
  }],
  currentLocale: computed('locale', {
    get() {
      return get(this, 'locales').findBy('code', get(this, 'locale'));
    },
    set(_, locale) {
      set(this, 'locale', locale.code);
      return locale;
    }
  }),
  currentHostname: computed({
    get() {
      return window.location.host;
    }
  })
});
