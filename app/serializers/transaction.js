import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  attrs: {
    paymentProcessorUrl: { serialize: false }
  }
});
