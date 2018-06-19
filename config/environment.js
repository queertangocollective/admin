'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: '@queertangocollective/admin',
    environment,
    rootURL: '/',
    locationType: 'auto',
    API_KEY: 'c0af655443ad20ed921dfe41049a58c5',
    API_HOST: 'http://localhost:3000',
    ZIP_API_KEY: 'js-UgjzTROXe9B7ac3ruujT6W4TqAIwT86OppnihcfwlRDw4HYycisiewcE7Va03hOt',
    VERSION: '{{build.id}}',
    GOOGLE_MAPS_API_KEY: 'AIzaSyCEXiB9AwC377Dhmbni6tRWGnfjHvhTQcE',
    moment: {
      includeTimezone: 'all'
    },
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
    ENV.API_HOST = 'https://api.queertangocollective.org';
    ENV.API_KEY = 'c40599e3112d27cf6d35127d2b9e4eae';
    ENV.ZIP_API_KEY = 'js-TNJWbVTaBV26fbIyFuKZRZ97SER4f1J9Er8XoiVpT67xN2bea5uOVXgebNFHHMFz';
    ENV.GOOGLE_MAPS_API_KEY = 'AIzaSyBRoseyODw0jyZi4lcw-rSsQmmYu0l7go0';
    ENV.torii.providers['facebook-oauth2'].redirectUri = 'https://admin.queertangocollective.org/torii/redirect.html';
    ENV.torii.providers['google-oauth2'].redirectUri = 'https://admin.queertangocollective.org/torii/redirect.html';
    ENV.SENTRY_DSN = 'https://90fd196af750400aac4cd69d642589c5@sentry.io/293902';
  }

  return ENV;
};
