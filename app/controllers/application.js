import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { gt, reads } from '@ember/object/computed';
import config from '../config/environment';
import fetch from 'fetch';

export default Controller.extend({
  fileQueue: service(),
  session: service(),
  progress: reads('fileQueue.progress'),
  canAccessOtherGroups: gt('authorizedGroups.length', 1),
  authorizedGroups: computed('session.groupAccess', function () {
    return this.get('session.groupAccess') || [];
  }),
  activeGroup: computed('authorizedGroups', 'session.currentGroup', function () {
    return this.authorizedGroups.findBy('id', this.session.get('currentGroup.id'));
  }),

  actions: {
    changeGroup(group) {
      if (group == null || group.id === this.get('session.currentGroup.id')) return;

      let token = window.localStorage && localStorage.getItem('qtc-token');
      return fetch(config.API_HOST + '/authorization_sessions/' + this.get('session.id'), {
        method: 'PUT',
        headers: {
          'Api-Key': config.API_KEY,
          'Access-Token': token,
          'Content-Type': 'application/vnd.api+json'
        },
        body: JSON.stringify({
          group_id: group.id
        })
      });
    }
  }
});
