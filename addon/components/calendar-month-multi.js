/**
 * @todo don't show last/first week twice across two consecutive months
 * @todo smart-zoom (1 mo, 3 mo, 6mo, > 6mo)
 * @todo if there are 4 months => display 6 months. figure out how to display those 2 extra months
 */

import Ember from 'ember';
import layout from '../templates/components/calendar-month-multi';

const {
  computed,
  on
} = Ember;

const Month = Ember.Object.extend({
  month: null,
  year: null,

  /**
   * Show last partial week
   * If current month ends on a Tuesday, don't show this month on this calendar, but rather the next month
   * This should be true for the last month
   * @todo verify this works
   * @type {Boolean}
   */
  showLastPartialWeek: false
})

export default Ember.Component.extend({
  layout,
  classNames: ['calendar-month-multi'],

  // canonical
  startDate: null,
  endDate: null,

  context: null,

  /**
   * Max months to show
   * @type {Number}
   */
  maxMonthsToShow: 6,

  _onDidReceiveAttrs: on('didReceiveAttrs', function() {
    // validate starDate and endDate are valid moment objects
    if (!moment.isMoment(this.get('startDate')) || !moment.isMoment(this.get('endDate'))) {
      this.setProperties({
        startDate: moment(this.get('startDate')),
        endDate: moment(this.get('endDate'))
      });
    }

    // validate startDate is before endDate
    if (this.get('endDate').isBefore(this.get('startDate'))) {
      throw new Error('Start date must be before end date', this.get('startDate'), this.get('endDate'));
    }
  }),

  /**
   * Override this method in your controller
   * @param {object} date - moment date
   * @return {string} class name to be applied to this date
   */
  customClassFunction(date) {
    return false;
  },

  /**
   * Don't show duplicate end of last month/beginning of this month
   * If endDate - startDate = 2 months, still display 3 months (pad one on end)
   * If endDate - startDate > 6 mo, display "next" and "previous"
   * @type {array} array of months
   */
  displayMonths: computed('startDate', 'endDate', function() {
    var months = [];

    var current = this.get('startDate');

    for (let i = 0; i < this.get('numberOfMonthsToDisplay'); i++) {
        months.addObject(Month.create({
          // current.month() is 0-indexed, but calendar-month expects 1-indexed month
          month: current.month(),
          year: current.year(),
          showLastPartialWeek: (i === this.get('numberOfMonthsToDisplay') - 1) || (current.endOf('month').weekday() < 3)
        }));
        current.add(1, 'month');
    }

    return months;
  }),

  /**
   * The number of months to display
   * @type {number}
   */
  numberOfMonthsToDisplay: computed('startDate', 'endDate', 'maxMonthsToShow', function() {
    var startDate = this.get('startDate');
    var endDate = this.get('endDate');

    if (startDate.month() === endDate.month()) {
      return 1;
    }

    var monthsDiff = endDate.diff(startDate, 'months');

    if (monthsDiff > this.get('maxMonthsToShow')) {
      return this.get('maxMonthsToShow');
    }

    return monthsDiff;
  })
});
