/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'queertangocollective',
    environment,
    rootURL: '/',
    locationType: 'auto',
    API_KEY: 'c0af655443ad20ed921dfe41049a58c5',
    API_HOST: 'http://localhost:3000',
    ZIP_API_KEY: 'js-UgjzTROXe9B7ac3ruujT6W4TqAIwT86OppnihcfwlRDw4HYycisiewcE7Va03hOt',
    GOOGLE_MAPS_API_KEY: 'AIzaSyCEXiB9AwC377Dhmbni6tRWGnfjHvhTQcE',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    torii: {
      // a 'session' property will be injected on routes and controllers
      sessionServiceName: 'session',
      providers: {
        'facebook-oauth2': {
          apiKey: '1515089595488289',
          scope: 'email',
          redirectUri: 'http://localhost:4200/torii/redirect.html'
        },
        'google-oauth2': {
          apiKey: '725704560328-rnn4p5lieg6uqvuj7qjaen8o8asrr79m.apps.googleusercontent.com',
          scope: 'email',
          redirectUri: 'http://localhost:4200/torii/redirect.html'
        }
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {

  }

  return ENV;
};
