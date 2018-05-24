import { inject as service } from '@ember/service';
import EmberObject, { get } from '@ember/object';
import RSVP, { reject } from 'rsvp';
import config from '../config/environment';
import fetch from 'fetch';

export default EmberObject.extend({

  store: service(),

  fetch() {
    let token = window.localStorage && localStorage.getItem('qtc-token');
    if (token == null) {
      return reject();
    }

    return fetch(config.API_HOST + '/authorization_sessions', {
      headers: {
        'Api-Key': config.API_KEY,
        'Access-Token': token,
        'Content-Type': 'application/vnd.api+json'
      }
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("You've been logged out");
      }
    }).then((json) => {
      return RSVP.all([
        get(this, 'store').find('person', json.data.attributes['person-id']),
        get(this, 'store').find('authorization', json.data.attributes['authorization-id'])
      ]);
    }).then(function ([person, authorization]) {
      return RSVP.all([
        person,
        authorization,
        authorization.get('group')
      ]);
    }).then(function ([person, authorization, group]) {
      return {
        currentPerson: person,
        currentAuthorization: authorization,
        currentGroup: group
      };
    });
  },

  open(data) {
    return fetch(config.API_HOST + '/authorization_sessions', {
      method: 'POST',
      headers: {
        'Api-Key': config.API_KEY,
        'Content-Type': 'application/vnd.api+json'
      },
      body: JSON.stringify({
        provider: data.provider.replace('-oauth2', ''),
        code: data.authorizationCode,
        'redirect-uri': data.redirectUri
      })
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("There's no login using that email");
      }
    }).then((json) => {
      localStorage.setItem('qtc-token', json.data.attributes['access-token']);
      return RSVP.all([
        get(this, 'store').find('person', json.data.attributes['person-id']),
        get(this, 'store').find('authorization', json.data.attributes['authorization-id']),
        get(this, 'store').peekAll('group').get('firstObject')
      ]);
    }).then(function ([person, authorization, group]) {
      return {
        currentPerson: person,
        currentAuthorization: authorization,
        currentGroup: group
      };
    });
  },

  close() {
    return fetch(config.API_HOST + '/authorization_sessions/' + localStorage.getItem('qtc-token'), {
      method: 'DELETE',
      headers: {
        'Api-Key': config.API_KEY,
        'Access-Token': localStorage.getItem('qtc-token'),
        'Content-Type': 'application/vnd.api+json'
      }
    }).then(function() {
      localStorage.removeItem('qtc-token');
    });
  }
});
