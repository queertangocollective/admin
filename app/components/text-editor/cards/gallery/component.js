import Component from "@ember/component";
import { computed, set } from "@ember/object";
import { run } from "@ember/runloop";
import { all } from "rsvp";
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

  toolbar: computed("payload.{size,photoIds}", function() {
    let size = this.payload.size;
    let items = [];

    if (this.payload.photoIds && this.payload.photoIds.length > 0) {
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
        title: "Choose Photos",
        text: "Choose Photos",
        action: () => {
          this.set("isFindingPhoto", true);
        }
      });
    }

    if (items.length > 0) {
      return { items };
    }
  }),

  store: service(),

  init() {
    this._super();
    this.set("isLoading", true);

    if (!this.payload) {
      this.set("payload", {});
    }

    this.registerComponent(this);

    all(
      (this.payload.photoIds || []).map(id =>
        this.store.findRecord("photo", id)
      )
    ).then(photos => {
      if (this.isDestroyed) return;
      this.set("isLoading", false);
      this.set("photos", photos);
      this.set("selection", photos.slice());
    });
  },

  actions: {
    updateCaption(caption) {
      this._updatePayloadAttr("caption", caption);
    },

    setPhotos(photos) {
      this.set("photos", photos);
      this.set("selection", photos.slice());

      this._updatePayloadAttr("photoIds", photos.map(photo => photo.id));
      if (this.payload.size == null) {
        this._updatePayloadAttr("size", "small");
      }
      this.set("isFindingPhoto", false);
    }
  },

  _changeCardWidth(size) {
    this._updatePayloadAttr("size", size);
  },

  _updatePayloadAttr(attr, value) {
    let payload = this.payload;
    let save = this.saveCard;

    set(payload, attr, value);

    // update the mobiledoc and stay in edit mode
    save(payload, false);
  }
});
