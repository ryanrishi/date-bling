/**
 * @todo don't show last/first week twice across two consecutive months
 * @todo smart-zoom (1 mo, 3 mo, 6mo, > 6mo)
 */

import Ember from 'ember';
import layout from '../templates/components/calendar-month-multi';

export default Ember.Component.extend({
  layout,
  classNames: ['calendar-month-multi'],

  // canonical
  startDate: null,
  endDate: null,

  customClassFunction(date) {
    return false;
  }
});
