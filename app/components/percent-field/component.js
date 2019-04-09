import NumberField from '../number-field/component';

export default NumberField.extend({

  classNames: ['percent-field'],

  min: 0,

  max: 1,

  precision: 2,
  
  step: 0.01,

  multiplier: 0.01,

  style: 'percent'
});
