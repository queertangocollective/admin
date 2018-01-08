import config from './config/environment';

export default function () {
  let slow = config.environment === 'test' ? 0 : 600;

  this.transition(
    this.hasClass('snack-bar'),
    this.use('toaster', { duration: slow, easing: [600, 30] })
  );
}
