import Component from '@ember/component';
import { computed } from '@ember/object';
import { bind } from '@ember/runloop';
import { max } from '@ember/object/computed';

export default Component.extend({
  classNames: ['photo-grid'],
  idealHeight: 180,
  minimumShrink: 80,
  maxiumumStretch: 240,
  viewportWidth: 0,
  gutter: 10,

  didInsertElement() {
    this.set('viewportWidth', this.element.clientWidth + this.gutter);
    this.resize = bind(this, () => {
      let width = this.element.clientWidth + this.gutter;
      if (width !== this.viewportWidth) {
        this.set('viewportWidth', width);
      }
    });
    window.addEventListener('resize', this.resize);
  },

  willDestroyElement() {
    window.removeEventListener('resize', this.resize);
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
      if (height > this.maxiumumStretch && i < len - 1) {
        continue;
      } else if (height < this.minimumShrink) {
        break;
      } else {
        let score = Math.pow(Math.abs(this.idealHeight - height), 2);
        let nextRow = this.findPossibleRows(photos.slice(i + 1));
        height = Math.min(this.maxiumumStretch, height);
        validRows.push({
          score,
          height,
          photos: row.photos.slice().map((photo) => {
            return {
              photo,
              width: (photo.width / photo.height) * height
            };
          }),
          nextRow
        });
      }
    }
    return validRows;
  },

  getScores(rows, result={ score: 0, rows: [] }, state={ minimum: Infinity }) {
    let results = [];
    for (let i = 0, len = rows.length; i < len; i++) {
      let row = rows[i];
      let path = {
        score: result.score + row.score,
        rows: [...result.rows, row]
      };
      if (row.nextRow.length === 0) {
        if (path.score < state.minimum) {
          results.push(path);
          state.minimum = path.score;
        }
      } else {
        results.push(...this.getScores(row.nextRow, path, state));
      }
    }
    return results;
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
    let results = this.getScores(rows);
    return results[results.length - 1].rows;
  })
});
