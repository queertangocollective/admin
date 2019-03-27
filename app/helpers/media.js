import Helper from '@ember/component/helper';

export default Helper.extend({
  compute([query]) {
    if (query) {
      this.query = window.matchMedia(query);
      this.query.onchange = () => {
        this.recompute();
      };
    }
    return this.query.matches;
  },
});
