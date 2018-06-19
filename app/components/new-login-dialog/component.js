import Component from '@ember/component';
import sort from '../../computed/sort';

export default Component.extend({
  sort: 'email',
  sortableLogins: sort('logins', 'sort')
});
