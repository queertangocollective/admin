import Ember from 'ember';
import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

if (config.SENTRY_DSN) {
  Raven.config(config.SENTRY_DSN, {
      release: config.VERSION
    })
    .addPlugin(Raven.Plugins.Ember, Ember)
    .install();
}

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
