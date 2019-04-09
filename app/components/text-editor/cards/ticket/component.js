import Component from '@ember/component';
import { computed, set } from '@ember/object';
import { bind, next } from '@ember/runloop';

export default Component.extend({
  init() {
    this._super();

    if (!this.payload) {
      this.set('payload', {});
    }

    this.registerComponent(this);
  },

  willDestroyElement() {
    if (this._onMousedownHandler) {
      window.removeEventListener('mousedown', this._onMousedownHandler);
    }
  },

  toolbar: computed('payload.ticketId', function () {
    if (this.payload.ticketId) {
      return {
        items: [{
          title: 'Change Text',
          text: 'Change Text',
          action: () => {
            this.set('callToAction', this.payload.callToAction);
            this.selectedRange = this.editor.range;
            this.set('isChangingButtonText', true);
            next(() => {
              this._onMousedownHandler = bind(this, this._handleMousedown);
              window.addEventListener('mousedown', this._onMousedownHandler);
            });
          }
        }, {
          title: 'Choose Ticket',
          text: 'Choose Ticket',
          action: () => {
            this.set('isAddingTicket', true);
          }
        }]
      };
    }
  }),

  _handleMousedown(event) {
    if (!event.target.closest(`#${this.elementId}`)) {
      // no need to re-select for mouse clicks
      this._cancelAndReselect();
    }
  },

  _cancelAndReselect() {
    this.set('isChangingButtonText', false);
    if (this.selectedRange) {
      this.editor.selectRange(this.selectedRange);
      this.selectedRange = null;
      this.editor.enableEditing();
    }

    if (this._onMousedownHandler) {
      window.removeEventListener('mousedown', this._onMousedownHandler);
      this._onMousedownHandler = null;
    }
  },

  actions: {
    addTicket(ticket) {
      let payload = this.payload;
      let save = this.saveCard;

      set(payload, 'ticketId', ticket.id);
      if (payload.callToAction == null) {
        set(payload, 'callToAction', 'Sign Up');
      }

      // update the mobiledoc and stay in edit mode
      save(payload, false);
      this.set('isAddingTicket', false);
    },

    updateCallToAction(callToAction, evt) {
      evt.preventDefault();

      let payload = this.payload;
      let save = this.saveCard;

      set(payload, 'callToAction', callToAction);

      // update the mobiledoc and stay in edit mode
      save(payload, false);
      this._cancelAndReselect();
    },

    cancel(evt) {
      evt.preventDefault();
      this._cancelAndReselect();
    }
  }
});
