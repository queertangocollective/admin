import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    numberSold: { serialize: false }
  }
});
