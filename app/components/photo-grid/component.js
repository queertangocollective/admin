import Component from '@ember/component';
import { computed } from '@ember/object';
import { bind } from '@ember/runloop';

export default Component.extend({
  classNames: ['photo-grid'],
  viewportWidth: 0,
  gutter: 8,
  singleRow: false,

  getMinAspectRatio(lastWindowWidth) {
    if (lastWindowWidth <= 640) {
      return 2;
    } else if (lastWindowWidth <= 800) {
      return 2;
    } else if (lastWindowWidth <= 1280) {
      return 4;
    } else if (lastWindowWidth <= 1920) {
      return 5;
    }
    return 6;
  },

  didRender() {
    let lastItem = this.element.querySelector('.photo-grid-row:last-child');
    if (lastItem === this._lastItem) return;

    if (this._lastItem) {
      this.loadObserver.unobserve(this._lastItem);
      this._lastItem = null;
    }

    if (lastItem) {
      this.loadObserver.observe(lastItem);
      this._lastItem = lastItem;
    }
  },

  didInsertElement() {
    this.set('viewportWidth', this.element.clientWidth + this.gutter);
    this.observer = new ResizeObserver(bind(this, ([entry]) => {
      let width = entry.contentRect.width + this.gutter;
      if (this.viewportWidth !== width) {
        this.set('viewportWidth', width);
      }
    }));
    this.observer.observe(this.element);

    this.loadObserver = new IntersectionObserver(bind(this, entries => {
      let isInView = entries[entries.length - 1].isIntersecting;
      if (!this.isLoading && isInView && this.hasMore) {
        this.set('loadingCount', Math.min(this.total - this.photos.length, 50));
        this.load(this.photos.length).then(({ model, meta }) => {
          this.set('photos', [...this.photos.toArray(), ...model.toArray()]);
          this.set('total', meta.page.total);
        }).finally(() => {
          this.set('loadingCount', 0);
        });
      }
    }));
  },

  willDestroyElement() {
    this.observer.unobserve(this.element);
    if (this._lastItem) {
      this.loadObserver.unobserve(this._lastItem);
      this._lastItem = null;
    }
  },

  hasMore: computed('total', 'photos.length', function () {
    return this.total > this.photos.length ? this.photos.length : 0;
  }),

  rows: computed('viewportWidth', 'photos', 'loadingCount', function () {
    if (this.photos == null || this.photos.length === 0 || this.viewportWidth <= 0) {
      return [];
    }

    let viewportWidth = this.viewportWidth;
    let minAspectRatio = this.singleRow ?
      Infinity :
      this.getMinAspectRatio(viewportWidth);
    let rows = [];
    let row = {
      aspectRatio: 0,
      photos: []
    };

    this.photos.forEach((photo, index) => {
      let aspectRatio = photo.width / photo.height;
      row.aspectRatio += aspectRatio;
      row.photos.push(photo);

      if (row.aspectRatio >= minAspectRatio || (index + 1 === this.photos.length && this.loadingCount === 0)) {
        if (minAspectRatio !== Infinity) {
          row.aspectRatio = Math.max(row.aspectRatio, minAspectRatio);
        }

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

    while (this.loadingCount-- > 0) {
      row.aspectRatio += 1.5;
      row.photos.push({
        isPlaceholder: true,
        id: `placeholder-${this.loadingCount}`,
        width: 300,
        height: 200
      });

      if (row.aspectRatio >= minAspectRatio || this.loadingCount === 0) {
        if (minAspectRatio !== Infinity) {
          row.aspectRatio = Math.max(row.aspectRatio, minAspectRatio);
        }

        let width = viewportWidth - (row.photos.length * this.gutter);
        let height = width / row.aspectRatio;
        row.height = height;
        row.photos = row.photos.map(photo => {
          return {
            photo,
            isPlaceholder: !!photo.isPlaceholder,
            width: (photo.width / photo.height) * height
          }
        });
        rows.push(row);
        row = {
          aspectRatio: 0,
          photos: []
        };
      }
    }

    if (row.photos.length) {
      rows.push(row);
    }

    return rows;
  })
});
