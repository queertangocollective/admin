import Component from '@ember/component';
import { getLayout } from 'dom-ruler';
import { bind, debounce } from '@ember/runloop';
import { computed } from '@ember/object';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';

export default Component.extend({

  duration: 300,

  classNames: ['action-bar'],

  didReceiveAttrs() {
    this._super();
    let allActions = this.actionNames.reduce((E, name) => {
      let descriptor = {
        label: `${this.for}.actions.${name}`,
        icon: this[`${name}Icon`],
        active: true
      };

      let action = this[name];
      if (action == null) {
        descriptor.active = false;
      } else if (typeof action === 'string') {
        if (action.indexOf('mailto:') === 0) {
          descriptor.link = action;
          descriptor.isMailTo = true;
        } else if (action.indexOf('//') === 0 ||
                   action.indexOf('http') === 0) {
          descriptor.link = action;
          descriptor.isExternalLink = true;
        } else {
          descriptor.routeParams = [action];
          descriptor.isLink = true;
        }
      } else if (Array.isArray(action)) {
        descriptor.routeParams = action;
        descriptor.isLink = true;
      } else if (action.args && action.inner) {
        descriptor.component = action;
        descriptor.isDialog = true;
      } else if (action.apply) {
        descriptor.submit = action;
        if (name === 'delete') {
          descriptor.isDelete = true;
          descriptor.confirm = `${this.for}.actions.confirmDelete`;
        } else {
          descriptor.isAction = true;
        }
      }

      if (descriptor.active) {
        E.push(descriptor);
      }
      return E;
    }, []);
    this.metrics = null;
    this.set('pages', [{
      index: 0,
      hasMore: true,
      actions: allActions,
      hasLess: false
    }]);
    this.set('currentPageNumber', 0);
    this.scheduleMeasurement();
  },

  currentPage: computed('currentPageNumber', 'pages', function () {
    if (this.pages) {
      return this.pages[this.currentPageNumber];
    }
    return null;
  }),

  displayDuration: computed('isMeasuring', 'duration', function () {
    return this.isMeasuring ? 0 : this.duration;
  }),

  scheduleMeasurement() {
    this.set('isMeasuring', true);
    debounce(() => {
      if (this.isDestroyed) return;
      this.measure();
      this.set('isMeasuring', false);
    }, 50);
  },

  didInsertElement() {
    this.scheduleMeasurement();
    this.resize = bind(this, 'scheduleMeasurement');
    window.addEventListener('resize', this.resize);
  },

  willDestroyElement() {
    window.removeEventListener('resize', this.resize);
  },

  rules({ oldItems, newItems }) {
    if (oldItems.length && oldItems[0] != null &&
        newItems.length && newItems[0] != null) {
      if (oldItems[0].index < newItems[0].index) {
        return toLeft;
      } else if (oldItems[0].index > newItems[0].index) {
        return toRight;
      }
    }
    return;
  },

  measure() {
    if (this.element.querySelector('nav') == null) {
      return;
    }

    if (this.metrics == null) {
      let buttons = this.element.querySelector('.actions').children;
      this.metrics = {
        actions: this.pages[0].actions.map((action, i) => {
          return {
            action,
            width: getLayout(buttons[i]).margins.width
          };
        }),
        page: getLayout(this.element.querySelector('button.next-page')).margins.width
      };
    }

    let space = getLayout(this.element.querySelector('.page')).content.width;
    let pages = [];
    let size = this.metrics.page;
    let page = [];
    let metrics = [...this.metrics.actions];

    while (metrics.length > 0) {
      let { action, width } = metrics.shift();
      if (size + width > space) {
        if (pages.length) {
          pages[pages.length - 1].hasMore = true;
        }
        pages.push({
          index: pages.length,
          hasLess: pages.length > 0,
          actions: page,
          hasMore: false
        });
        page = [];
        size = this.metrics.page * 2;
      }

      page.push(action);
      size += width;
    }

    if (page.length > 0) {
      if (pages.length) {
        pages[pages.length - 1].hasMore = true;
      }
      pages.push({
        index: pages.length,
        hasLess: pages.length > 0,
        actions: page,
        hasMore: false
      });
    }
    this.set('pages', pages);
  },

  actions: {
    nextPage() {
      if (this.currentPageNumber < this.pages.length - 1) {
        this.set('currentPageNumber', this.currentPageNumber + 1);
      }
    },
    previousPage() {
      if (this.currentPageNumber > 0) {
        this.set('currentPageNumber', this.currentPageNumber - 1);
      }
    }
  }

}).reopenClass({
  positionalParams: 'actionNames'
});
