import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  attrs: {
    updatedAt: { serialize: false },
    createdAt: { serialize: false }
  }
});
