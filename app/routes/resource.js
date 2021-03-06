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
      params.pop();
      this.flash(params.join(''), {
        timeout: 2500
      });
    },

    accessDenied() {
      this.transitionTo('index');
    },

    deleteRecord(model) {
      return model.destroyRecord().then(() => {
        this.flash(`"${model.name || model.title || model.email || model.description || model.filename}" was removed.`, {
          timeout: 5000
        });
        let [modelName] = this.routeName.split('.');
        if (modelName === 'index') {
          modelName = this.routeName.split('.')[0];
        }
        this.replaceWith(this.collectionRoute || `${pluralize(modelName)}`);
      });
    }
  }
});
