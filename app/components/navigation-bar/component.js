import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { observer, get, computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import move from 'ember-animated/motions/move';
import { getLayout, measureText } from 'dom-ruler';
import { bind, debounce } from '@ember/runloop';

export default Component.extend({

  duration: 300,

  classNames: ['navigation-bar'],

  router: service(),

  intl: service(),

  fileQueue: service(),

  progress: reads('fileQueue.progress'),

  init() {
    this._super();
    this.didTransition();
    this.set('visibleRoutes', ['home']);
  },

  displayDuration: computed('isMeasuring', 'duration', function () {
    return this.isMeasuring ? 0 : this.duration;
  }),

  scheduleMeasurement() {
    this.set('isMeasuring', true);
    debounce(() => {
      if (this.isDestroyed) return;
      this.set('isMeasuring', false);
      this.measure();
    }, 10);
  },

  didInsertElement() {
    this.measure();
    this.resize = bind(this, 'scheduleMeasurement');
    window.addEventListener('resize', this.resize);
  },

  willDestroyElement() {
    window.removeEventListener('resize', this.resize);
  },

  *slide({ insertedSprites, removedSprites }) {
    insertedSprites.map((sprite) => {
      sprite.startAtPixel({ x: 0, y: sprite.finalBounds.height * -1 + 36 });
      return move(sprite);
    });
    removedSprites.map((sprite) => {
      sprite.endAtPixel({ x: 0, y: sprite.initialBounds.height * -1 + 36 });
      return move(sprite);
    });
    yield;
  },

  mobileRoutes: computed('routes', function () {
    return this.routes.split(' ');
  }),

  measure() {
    if (this.element.querySelector('a') == null ||
        this.element.querySelector('nav') == null) {
      return;
    }

    let routes = [...this.routes.split(' '), 'more'].map((routeName) => {
      return {
        routeName,
        width: measureText(this.intl.t(`navigation.${routeName}`), {
          whiteSpace: 'nowrap',
          marginRight: '0.25rem'
        }, {
          template: this.element.querySelector('a')
        }).margins.width
      };
    });

    let more = routes.pop();
    let space = getLayout(this.element.querySelector('nav')).content.width - more.width;
    let submit = this.element.querySelector('.submit-button');
    if (submit) {
      space -= getLayout(submit).margins.width;
    }
    let visible = [];
    let invisible = routes;
    while (space > 0 && invisible.length > 0) {
      let route = invisible.shift();
      space -= route.width;
      visible.push(route);
    }
    if (space < 0) {
      invisible.unshift(visible.pop());
    }
    this.set('visibleRoutes', visible.map((route) => route.routeName));
    this.set('hiddenRoutes', invisible.map((route) => route.routeName));
  },

  didTransition: observer('router.currentRouteName', function () {
    get(this, 'router.currentRouteName'); // Necessary for triggering observation
    this.set('isActive', false);
  })
});
