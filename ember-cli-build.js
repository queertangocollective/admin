'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    origin: 'https://admin.queertangocollective.org',
    autoprefixer: {
      browsers: ['last 2 versions'],
      cascade: false
    },
    sri: {
      enabled: true,
      crossorigin: 'anonymous'
    },
    fingerprint: {
      prepend: 'https://builds.queertangocollective.org/admin/'
    },
    sassOptions: {
      includePaths: [
        'app/styles',
        'app/components',
        'node_modules/@queertangocollective/ui/addon/styles'
      ]
    },
    svgJar: {
      strategy: 'inline',
      sourceDirs: [
        'node_modules/@queertangocollective/ui/public/assets/images/icons',
        'public/assets/images/icons'
      ],
      inline: {
        copypastaGen: (assetId) => `{{icon '${assetId}'}}`
      }
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.
  app.import('node_modules/raven-js/dist/raven.js');
  app.import('node_modules/raven-js/dist/plugins/ember.js');

  return app.toTree();
};
