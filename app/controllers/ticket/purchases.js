import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['sort', 'q'],
  q: '',
  sort: '-paid-by.name',
});
