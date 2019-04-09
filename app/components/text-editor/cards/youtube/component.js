import Component from '@ember/component';
import { computed, get, set } from '@ember/object';
import { bind } from "@ember/runloop";
import config from '../../../../config/environment';

export default Component.extend({
  classNames: ['youtube-card'],
  classNameBindings: ['isActive:active'],

  init() {
    this._super(...arguments);

    if (!this.payload) {
      this.set("payload", {});
    }

    this.registerComponent(this);
  },

  style: computed('payload.{width,height}', function () {
    let aspectRatio = this.payload.height / this.payload.width;
    return `width: 100%; padding-bottom: ${aspectRatio * 100}%;`
  }),

  didRender() {
    let element = this.element.parentElement.parentElement.parentElement;
    element.classList.remove("align-left", "align-right");
    if (this.payload.align !== "center") {
      element.classList.add(`align-${this.payload.align}`);
    }
  },

  videoId: computed('payload.url', {
    get() {
      let url = get(this, 'payload.url');
      return (
        url.match(/youtube\.com\/watch\?v=([^/]+)/) ||
        url.match(/youtu.be\/([^/]+)/) ||
        url.match(/youtube\.com\/embed\/([^/]+)/)
      )[1];
    }
  }),

  origin: computed({
    get() {
      return window.protocol + '//' + window.hostname;
    }
  }),

  _cancelAndReselect() {
    this.set('isEditingURL', false);
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

  toolbar: computed("payload.{size,align,url}", function() {
    let size = this.payload.size;
    let align = this.payload.align;
    let items = [];

    if (this.payload.url) {
      items.push({
        title: "Regular",
        icon: "small",
        active: size === "small",
        action: bind(this, this._changeCardWidth, "small")
      });

      items.push({
        title: "Wide",
        icon: "medium",
        active: size === "medium",
        action: bind(this, this._changeCardWidth, "medium")
      });

      items.push({
        title: "Full",
        icon: "large",
        active: size === "large",
        action: bind(this, this._changeCardWidth, "large")
      });

      items.push({
        title: "Align Left",
        icon: "align-left",
        active: align === "left",
        action: bind(this, this._changeAlignment, "left")
      });

      items.push({
        title: "Center",
        icon: "align-center",
        active: align === "center",
        action: bind(this, this._changeAlignment, "center")
      });

      items.push({
        title: "Align Right",
        icon: "align-right",
        active: align === "right",
        action: bind(this, this._changeAlignment, "right")
      });

      items.push({
        title: "Replace Video",
        text: "Replace",
        action: () => {
          this.set("isReplacingVideo", true);
        }
      });
    }

    if (items.length > 0) {
      return { items };
    }
  }),

  _changeCardWidth(size) {
    this._updatePayloadAttr("size", size);
    if (size !== "small") {
      this._updatePayloadAttr("align", "center");
    }
  },

  _changeAlignment(align) {
    if (align !== "center") {
      this._updatePayloadAttr("size", "small");
    }
    this._updatePayloadAttr("align", align);
  },

  _updatePayloadAttr(attr, value) {
    let payload = this.payload;
    let save = this.saveCard;

    set(payload, attr, value);

    // update the mobiledoc and stay in edit mode
    save(payload, false);
  },

  actions: {
    setUrl(url, evt) {
      evt.preventDefault();

      let payload = this.payload;
      let save = this.saveCard;

      set(payload, 'url', url);
      fetch(`${config.API_HOST}/oembed?url=${escape(url)}`, {
        mode: 'cors',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Api-Key': config.API_KEY,
          'Access-Token': localStorage.getItem('qtc-token'),
          'Content-Type': 'application/vnd.api+json'
        }
      }).then((result) => {
        return result.json();
      }).then((oembed) => {
        this._updatePayloadAttr('width', oembed.width);
        this._updatePayloadAttr('height', oembed.height);
      });

      // update the mobiledoc and stay in edit mode
      save(payload, false);
      this._cancelAndReselect();
    },
    deleteCard() {

    }
  }
});
