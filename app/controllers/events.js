import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['as'],
  sort: '-endsAt',
  as: 'calendar'
});
