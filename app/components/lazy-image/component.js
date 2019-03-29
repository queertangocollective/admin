import Component from '@ember/component';
import { computed } from '@ember/object';
import { run } from '@ember/runloop';

export default Component.extend({

  classNames: ['lazy-image'],
  classNameBindings: ['isLoaded::loading'],
  attributeBindings: ['style'],

  style: computed('width', 'height', function () {
    return `width: ${this.width}px; height: ${this.height}px`;
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
  },

  willDestroyElement() {
    this._observer.unobserve(this.element);
  }
});
