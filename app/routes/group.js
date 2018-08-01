import Resource from './resource';

export default Resource.extend({

  model() {
    return this.session.get('currentGroup');
  },

  actions: {
    createChannel() {
      let channel = this.store.createRecord('channel', {
        group: this.currentModel
      });
      this.currentModel.get('channels').pushObject(channel);
    }
  }
});
