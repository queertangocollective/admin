import Component from '@ember/component';
import { computed } from '@ember/object';
import { bind, debounce } from '@ember/runloop';
import move from 'ember-animated/motions/move';
import scale from 'ember-animated/motions/scale';
import opacity from 'ember-animated/motions/opacity';
import { parallel } from 'ember-animated';

export default Component.extend({
  classNames: ['photo-grid'],
  viewportWidth: 0,
  duration: 300,
  gutter: 8,

  getMinAspectRatio(lastWindowWidth) {
    if (lastWindowWidth <= 640) {
      return 2;
    } else if (lastWindowWidth <= 1280) {
      return 4;
    } else if (lastWindowWidth <= 1920) {
      return 5;
    }
    return 6;
  },

  *transition({ insertedSprites, receivedSprites, sentSprites }) {
    if (sentSprites.length === 0 && receivedSprites.length === 0) {
      return;
    }
    // received and sent sprites are flying above all the others
    receivedSprites.concat(sentSprites).forEach(sprite => {
      sprite.applyStyles({
        'z-index': 1,
        'overflow': 'visible'
      });
    });

    receivedSprites.forEach(parallel(move, scale));
    sentSprites.forEach(parallel(move, scale));

    insertedSprites.forEach(sprite => {
      opacity(sprite, { from: 0, to: 1 });
    });
    yield;
  },

  didInsertElement() {
    let duration = this.duration;
    this.set('viewportWidth', this.element.clientWidth + this.gutter);
    this.resize = bind(this, () => {
      let width = this.element.clientWidth + this.gutter;
      if (this.viewportWidth !== width) {
        this.set('duration', 0);
        this.set('viewportWidth', width);
        debounce(() => {
          this.set('duration', duration);
        }, 100);
      }
    });
    window.addEventListener('resize', this.resize);
  },

  willDestroyElement() {
    window.removeEventListener('resize', this.resize);
  },

  rows: computed('viewportWidth', 'photos', function () {
    if (this.photos == null || this.photos.length === 0 || this.viewportWidth <= 0) {
      return [];
    }

    let viewportWidth = this.viewportWidth;
    let minAspectRatio = this.getMinAspectRatio(viewportWidth);
    let rows = [];
    let row = {
      aspectRatio: 0,
      photos: []
    };

    this.photos.forEach((photo, index) => {
      let aspectRatio = photo.width / photo.height;
      row.aspectRatio += aspectRatio;
      row.photos.push(photo);

      if (row.aspectRatio >= minAspectRatio || index + 1 === this.photos.length) {
        row.aspectRatio = Math.max(row.aspectRatio, minAspectRatio);

        let width = viewportWidth - (row.photos.length * this.gutter);
        let height = width / row.aspectRatio;
        row.height = height;
        row.photos = row.photos.map(photo => {
          return {
            photo,
            width: (photo.width / photo.height) * height
          }
        });
        rows.push(row);
        row = {
          aspectRatio: 0,
          photos: []
        };
      }
    });

    if (row.photos.length) {
      rows.push(row);
    }

    return rows;
  })
});
