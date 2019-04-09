import Component from '@ember/component';
import { computed } from '@ember/object';
import { bind, run } from '@ember/runloop';
import { htmlSafe } from '@ember/string';

export default Component.extend({

  classNames: ['lazy-image'],
  classNameBindings: ['isLoaded::loading'],
  attributeBindings: ['style'],

  style: computed('displayWidth', 'displayHeight', function () {
    return htmlSafe(`width: ${this.displayWidth}px; height: ${this.displayHeight}px; background-size: ${this.displayWidth * 3}px 100%;`);
  }),

  didInsertElement() {
    this._observer = new IntersectionObserver(entries => {
      let isInView = entries[entries.length - 1].isIntersecting;
      run(this, 'set', 'isInView', isInView);
      if (isInView) {
        this._observer.unobserve(this.element);
      }
    });
    this._observer.observe(this.element);

    if (this.resize) {
      this.set('elementWidth', this.element.parentElement.outerWidth);
      this.resizeObserver = new ResizeObserver(bind(this, ([entry]) => {
        let width = entry.contentRect.width;
        this.element.removeAttribute('style');
        if (this.elementWidth !== width) {
          this.set('elementWidth', width);
        }
      }));
      this.resizeObserver.observe(this.element.parentElement);
    }
  },

  aspectRatio: computed('width', 'elementWidth', 'resize', function () {
    if (this.resize) {
      return this.elementWidth / this.width;
    }
    return 1;
  }),

  displayWidth: computed('aspectRatio', 'width', function () {
    return this.width * this.aspectRatio;
  }),

  displayHeight: computed('aspectRatio', 'height', function () {
    return this.height * this.aspectRatio;
  }),

  willDestroyElement() {
    this._observer.unobserve(this.element);
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.element.parentElement);
    }
  }
});
