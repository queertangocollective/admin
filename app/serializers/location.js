import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    latitude: { serialize: false },
    longitude: { serialize: false }
  }
});
