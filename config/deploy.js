/* eslint-env node */
'use strict';

let repository = require('../package.json').repository;

module.exports = function(deployTarget) {
  let ENV = {
    build: {},
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: process.env.AWS_BUCKET_NAME,
      region: 'us-east-1',
      prefix: 'admin'
    },
    'qtc': {
      apiKey: process.env.API_KEY,
      apiHostname: 'api.queertangocollective.org',
      gitUrl: repository,
      privateKey: process.env.DEPLOY_KEY
    }
  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
    // configure other plugins for development deploy target here
  }

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production';
    // configure other plugins for staging deploy target here
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    // configure other plugins for production deploy target here
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
