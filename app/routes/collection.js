import Route from '@ember/routing/route';
import { get, computed } from '@ember/object';
import Restricted from 'torii/routing/authenticated-route-mixin';
import { singularize } from 'ember-inflector';

export default Route.extend(Restricted, {

  queryParams: {
    sort: {
      refreshModel: true
    },
    q: {
      refreshModel: true
    }
  },

  modelName: computed({
    get() {
      return singularize(this.routeName);
    }
  }),

  query (params) {
    return this.store.query(get(this, 'modelName'), {
      sort: params.sort,
      page: {
        limit: 50,
        offset: params.offset
      },
      filter: {
        text: params.q
      },
      include: get(this, 'include')
    }).then(function (results) {
      return {
        model: results,
        meta: get(results, 'meta')
      };
    });
  },

  model(params) {
    return this.query(params);
  },

  actions: {
    accessDenied() {
      this.transitionTo('index');
    },

    load(offset) {
      return this.query({
        offset,
        sort: get(this.controller, 'sort'),
        q: get(this.controller, 'q')
      });
    }
  }
});
