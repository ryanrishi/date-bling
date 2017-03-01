import Ember from 'ember';
import layout from '../templates/components/readonly-calendar';
import JelliInputDatepicker from 'common/components/jelli-input-datepicker';

const DATEPICKER_ELEMENT = '.datepicker'

export default JelliInputDatepicker.extend({
  readOnly: true,
  startDate: '2017-01-20',
  endDate: '2017-02-28'
});
