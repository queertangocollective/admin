import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    paymentProcessorUrl: { serialize: false }
  }
});
