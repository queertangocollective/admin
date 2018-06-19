import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['sort', 'q'],
  q: '',
  sort: '-purchase.paid-at',

  actions: {
    updateAttendance(stub, attended) {
      stub.set('attended', attended);
      stub.save();
    }
  }
});
