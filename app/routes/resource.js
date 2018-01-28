import Route from '@ember/routing/route';
import Restricted from 'torii/routing/authenticated-route-mixin';
import method from 'ember-service-methods/inject';
import { pluralize } from 'ember-inflector';

export default Route.extend(Restricted, {

  model(params) {
    let segments = this.routeName.split('.');
    let modelName = segments.pop();
    let modelId = params[`${modelName}_id`];
    if (modelId) {
      return this.store.find(modelName, modelId);
    } else {
      return this.modelFor(segments.join('.'));
    }
  },

  flash: method(),

  save: method(),

  actions: {
    error() {
      let segments = this.routeName.split('.');
      let modelName = segments.pop();
      segments.push(pluralize(modelName));
      this.replaceWith(segments.join('.'));
    },

    save(model, changes) {
      return this.save(model, changes);
    },

    flash(...params) {
      this.flash(...params);
    },

    accessDenied() {
      this.transitionTo('index');
    },

    deleteRecord(model) {
      return model.destroyRecord().then(() => {
        this.flash(`"${model.get('name') || model.get('title') || model.get('email')}" was removed.`, {
          timeout: 5000
        });
        let [, modelName] = this.routeName.split('.');
        this.replaceWith(`${pluralize(modelName)}`);
      });
    }
  }
});
