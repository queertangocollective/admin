import Component from "@ember/component";
import { computed, set } from "@ember/object";
import { run } from "@ember/runloop";
import { inject as service } from "@ember/service";

export default Component.extend({
  // attrs
  files: null,
  payload: null,
  isSelected: false,
  isEditing: false,
  // properties
  handlesDragDrop: true,

  // closure actions
  selectCard() {},
  deselectCard() {},
  editCard() {},
  saveCard() {},
  deleteCard() {},
  moveCursorToNextSection() {},
  moveCursorToPrevSection() {},
  addParagraphAfterCard() {},
  registerComponent() {},

  store: service(),

  toolbar: computed("payload.{size,align,url,photoId}", function() {
    let size = this.payload.size;
    let align = this.payload.align;
    let items = [];

    if (this.payload.url) {
      items.push({
        title: "Regular",
        icon: "small",
        active: size === "small",
        action: run.bind(this, this._changeCardWidth, "small")
      });

      items.push({
        title: "Wide",
        icon: "medium",
        active: size === "medium",
        action: run.bind(this, this._changeCardWidth, "medium")
      });

      items.push({
        title: "Full",
        icon: "large",
        active: size === "large",
        action: run.bind(this, this._changeCardWidth, "large")
      });

      items.push({
        title: "Align Left",
        icon: "align-left",
        active: align === "left",
        action: run.bind(this, this._changeAlignment, "left")
      });

      items.push({
        title: "Center",
        icon: "align-center",
        active: align === "center",
        action: run.bind(this, this._changeAlignment, "center")
      });

      items.push({
        title: "Align Right",
        icon: "align-right",
        active: align === "right",
        action: run.bind(this, this._changeAlignment, "right")
      });

      items.push({
        title: "Replace Photo",
        text: "Replace",
        action: () => {
          this.set("isFindingPhoto", true);
        }
      });
    }

    if (items.length > 0) {
      return { items };
    }
  }),

  init() {
    this._super();

    if (!this.payload) {
      this.set("payload", {});
    }

    this.registerComponent(this);

    if (this.payload.photoId) {
      this.set("isLoading", true);
      this.store.findRecord("photo", this.payload.photoId).then(photo => {
        if (this.isDestroyed) return;
        this.set("isLoading", false);
        this.set("photo", photo);
        if (this.payload.width == null) {
          this._updatePayloadAttr("width", photo.width);
        }
        if (this.payload.height == null) {
          this._updatePayloadAttr("height", photo.height);
        }
      }, () => {
        this.set("isInvalid", true);
      });
    }
  },

  didRender() {
    let element = this.element.parentElement.parentElement.parentElement;
    element.classList.remove("align-left", "align-right");
    if (this.payload.align !== "center") {
      element.classList.add(`align-${this.payload.align}`);
    }
  },

  actions: {
    upload(file) {
      this.onupload(file).then(photo => {
        this.set('photo', photo);
        this._updatePayloadAttr("photoId", photo.id);
        this._updatePayloadAttr("url", photo.url);
        this._updatePayloadAttr("width", photo.width);
        this._updatePayloadAttr("height", photo.height);
        this._updatePayloadAttr("size", "small");
        this._updatePayloadAttr("align", "center");
      });
    },

    stopEvent(evt) {
      evt.stopPropagation();
      evt.preventDefault();
    },

    updateCaption(caption) {
      this._updatePayloadAttr("caption", caption);
    },

    setPhoto([photo]) {
      this.set('photo', photo);
      this._updatePayloadAttr("photoId", photo.id);
      this._updatePayloadAttr("url", photo.url);
      this._updatePayloadAttr("width", photo.width);
      this._updatePayloadAttr("height", photo.height);
      if (this.payload.size == null) {
        this._updatePayloadAttr("size", "small");
      }
      if (this.payload.align == null) {
        this._updatePayloadAttr("align", "center");
      }
      this.set("isFindingPhoto", false);
    }
  },

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
  }
});
