import { bind } from '@ember/runloop';
import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import { set, get } from '@ember/object';
import $ from 'jquery';

export default Component.extend({

  classNames: ['hero-image'],

  didInsertElement() {
    this._tile = bind(this, 'tile');
    $(window).on('resize', this._tile);
    $(window).on('orientationchange', this._tile);
    this._tile();
  },

  willDestroyElement() {
    $(window).off('resize', this._tile);
    $(window).off('orientationchange', this._tile);
  },

  didReceiveAttrs() {
    this.tile();
  },

  tile() {
    if (typeof document !== 'undefined' &&
        (get(this, 'element') == null ||
         get(this, 'hero') == null)) {
      return;
    }

    let imageSize = {
      width: get(this, 'hero.width'),
      height: get(this, 'hero.height')
    };

    let scale = 1;
    let width = get(this, 'hero.width');

    if (typeof document !== 'undefined') {
      let element = this.get('element');
      let height = get(this, 'hero.height');

      let display = element.style.display;
      element.style.display = 'none';
      height = $(document).height();
      element.style.display = display;

      width = window.innerWidth;
      let hero = this.get('element');
      display = hero.style.display;
      hero.style.display = 'none';

      hero.style.display = display;
      hero.style.height = height + 'px';
      hero.style.width = width + 'px';

      if ((width / height) > (imageSize.width / imageSize.height)) {
        scale = width / imageSize.width;
      } else {
        scale = height / imageSize.height;
      }
    }

    let margin = width - (imageSize.width * scale);
    set(this, 'style', htmlSafe(`height: ${imageSize.height * scale}px; width: ${imageSize.width * scale}px; margin-left: ${margin / 2}px`));
  }

});
