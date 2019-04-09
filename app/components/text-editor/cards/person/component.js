import Component from '@ember/component';
import { computed, set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['person-card'],
  store: service(),
  init() {
    this._super();

    if (!this.payload) {
      this.set('payload', {});
    }
  
    this.registerComponent(this);

    if (this.payload.personId) {
      this.set('isLoading', true);
      this.store.findRecord('person', this.payload.personId).then((person) => {
        if (this.isDestroyed) return;
        this.set('person', person);
        this.set('isLoading', false);
      });
    }
  },


  toolbar: computed('payload.personId', function () {
    if (this.payload.personId) {
      return {
        items: [{
          title: 'Choose Person',
          text: 'Choose Person',
          action: () => {
            this.set('isChoosingPerson', true);
          }
        }]
      };
    }
  }),


  actions: {
    nothing() {},
    setPerson(person) {
      let payload = this.payload;
      let save = this.saveCard;

      set(payload, 'personId', person.id);
      this.set('person', person);

      // update the mobiledoc and stay in edit mode
      save(payload, false);
      this.set('isChoosingPerson', false);
    }
  }
});
