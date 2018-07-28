import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

  idealHeight: 180,
  minimumShrink: 80,
  maxiumumStretch: 240,
  gutter: 10,

  didInsertElement() {
    this.set('viewportWidth', this.element.clientWidth - this.gutter);
  },

  findPossibleRows(photos) {
    let validRows = [];
    let row = {
      aspectRatio: 0,
      photos: []
    };
    let viewportWidth = this.viewportWidth;
    for (let i = 0, len = photos.length; i < len; i++) {
      let { photo, aspectRatio } = photos[i];
      row.photos.push(photo);
      row.aspectRatio += aspectRatio;

      let height = (viewportWidth - (row.photos.length * this.gutter)) / row.aspectRatio;
      if (height > this.maxiumumStretch) {
        continue;
      } else if (height < this.minimumShrink) {
        break;
      } else {
        validRows.push({
          score: Math.pow(Math.abs(this.idealHeight - height), 2),
          height,
          photos: row.photos.slice(),
          nextRow: this.findPossibleRows(photos.slice(i + 1))
        });
      }
    }
    return validRows;
  },

  rows: computed('idealHeight', 'viewportWidth', 'photos', function () {
    if (this.photos == null || this.photos.length === 0 || this.viewportWidth <= 0) {
      return [];
    }

    let photos = this.photos.map((photo) => {
      return {
        photo,
        aspectRatio: photo.width / photo.height
      };
    });

    let rows = this.findPossibleRows(photos);
    let idealRows = [];
    let row = rows.reduce((min, row) => {
      if (min.score > row.score) {
        return row;
      }
      return min;
    }, { score: Infinity, nextRow: [] });
    if (row.photos) {
      idealRows.push(row);
    }

    while (row.nextRow.length > 0) {
      rows = row.nextRow;
      row = rows.reduce((min, row) => {
        if (min.score > row.score) {
          return row;
        }
        return min;
      }, { score: Infinity });
      idealRows.push(row);
    }
    return idealRows;
  })
});
