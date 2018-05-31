import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    lastUsedAt: { serialize: false },
    fingerprint: { serialize: false }
  }
});
