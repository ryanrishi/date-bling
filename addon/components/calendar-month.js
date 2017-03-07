/**
 * @todo optional week number at start of week
 * @todo get rid of label constants and use moment
 */

import Ember from 'ember';
import layout from '../templates/components/calendar-month';

const {
  computed
} = Ember;

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAY_NAMES = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const NOT_THIS_MONTH_CLASS = 'not-this-month';

var DisplayDate = Ember.Object.extend({
  date: -1,
  isThisMonth: false,
});

function isPartialWeek(date) {
  console.debug('date', date, 'startOfweek', date.startOf('week'));
  let startOfWeek = date.startOf('week');
  const month = date.month();

  for (let i = 0; i < 7; i++) {
      if (startOfWeek.month() !== month) {
        return true;
      }
      startOfWeek = startOfWeek.add(1, 'day');
  }

  return false;
}

export default Ember.Component.extend({
  layout,
  classNames: ['calendar-month'],

  month: new Date().getMonth(),
  monthNames: MONTH_NAMES,
  monthName: computed('month', function() {
    return this.get('monthNames')[this.get('month')];
  }),
  weekdayNames: WEEKDAY_NAMES,

  showMonthName: true,
  showWeekdayNames: true,
  showYear: true,
  year: new Date().getFullYear(),
  notThisMonthClass: NOT_THIS_MONTH_CLASS,
  context: null,

  showLastPartialWeek: true,

  /**
   * @type {[type]}
   */
  canonicalFirstDayOfMonth: computed('month', 'year', function() {
    return moment().year(this.get('year')).month(this.get('month')).startOf('month');
  }),

  /**
   * Override this method in your controller
   * @example start date and end date over multiple months - this component doesn't know anything about start/end dates (and shouldn't)
   * @param {object} date - moment date
   * @return {string} class name to be applied to this date
   */
  customClassFunction(date) {
    return false;
  },

  /**
   * @todo use `moment.startOf('month').startOf('week')`
   * @todo rename this, since start of week might not be a Monday
   * @type {[type]}
   */
  firstMondayOfMonth: computed('canonicalFirstdayOfMonth', function() {
    var firstMondayOfMonth = moment(this.get('canonicalFirstDayOfMonth'));
    while (firstMondayOfMonth.weekday() !== 0) {
      firstMondayOfMonth.add(1, 'day');
    }

    return firstMondayOfMonth;
  }),

  numberOfDaysInMonth: computed('canonicalFirstDayOfMonth', function() {
    return moment(this.get('canonicalFirstDayOfMonth')).daysInMonth();
  }),

  numberOfWeeksInMonth: computed('canonicalFirstDayOfMonth', 'month', function() {
    var first = moment(this.get('canonicalFirstDayOfMonth'));
    var numWeeks = 0;

    while (first.month() === this.get('month')) {
      numWeeks++;
      // set to start of week after initial loop to catch partial weeks at end of month
      first.add(1, 'week').startOf('week');
    }

    // console.debug('month', this.get('month'), 'isLastWeekPartialWeek', isPartialWeek(this.get('canonicalFirstDayOfMonth').endOf('month')));
    if (isPartialWeek(this.get('canonicalFirstDayOfMonth').endOf('month')) && this.get('showLastPartialWeek') === false) {
      numWeeks--;
    }

    return numWeeks;
  }),

  displayWeeks: computed('numberOfWeeksInMonth', 'canonicalFirstDayOfMonth', 'month', function() {
    var weeks = [];

    var first = moment(this.get('canonicalFirstDayOfMonth'));
    var current = first.startOf('week');

    for (let i = 0; i < this.get('numberOfWeeksInMonth'); i++) {
      let days = [];
      for (let i = 0; i < 7; i++) {
        days.push(DisplayDate.create({
          date: current.date(),
          isThisMonth: this.get('month') === current.month(),
          // tdoo is this day, is this week, etc.
          customClass: this.get('customClassFunction').call(this, current)
        }));
        current.add(1, 'days');
      }
      weeks.push(days);
    }

    return weeks;
  })
});
