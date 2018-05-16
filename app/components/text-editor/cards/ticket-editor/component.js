import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  classNames: ['ticket-editor'],

  init() {
    this._super();
    this.store.findRecord('ticket', this.get('payload.ticketId')).then((ticket) => {
      if (this.isDestroyed) return;
      this.set('ticket', ticket);
    });
  },

  nothing() {},

  submit(payload, changes) {
    payload = Object.assign({}, payload);
    Object.assign(payload, changes);
    this.saveCard(payload);
  }
});