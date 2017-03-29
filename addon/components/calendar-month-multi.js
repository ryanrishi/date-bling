import Ember from 'ember';
import layout from '../templates/components/calendar-month-multi';

const {
  computed,
  on
} = Ember;

const Month = Ember.Object.extend({
  /**
   * 1-indexed month
   * @type {number}
   */
  month: null,

  /**
   * 1-indexed year
   * @type {number}
   */
  year: null,

  /**
   * Show last partial week
   * If current month ends on a Tuesday, don't show this month on this calendar, but rather the next month
   * This should always be true for the last month
   * @type {boolean}
   */
  showLastPartialWeek: true,

  /**
   * Show first partial week
   * If current month starts on a Thursday, don't show this month on this calendar, but rather on previous month's calendar
   * This should always be true for the first month
   * @type {boolean}
   */
  showFirstPartialWeek: true
});

export default Ember.Component.extend({
  layout,
  classNames: ['calendar-month-multi'],

  /**
   * Start date
   * @todo test different formats (canonical, moment, js date)
   * @type {object|string}
   */
  startDate: moment(),

  /**
   * End date
   * @todo test different formats (canonical, moment, js date)
   * @type {object|string}
   */
  endDate: moment(),

  /**
   * Pass in anything that you will need in `customClassFunction`
   * @example
   * ```hbs
   * {{calendar-month-multi
   *    startDate=today
   *    endDate=threeMonthsFromNow
   *    context=(hash
   *      startDate=today
   *      endDate=threeMonthsFromNow
   *      daysIWantToExclude=daysIWantToExclude)
   *    customClassFunction=customClassFunction}}
   * ```
   *
   * ```js
   * customClassFunction(date) {
   *   const { startDate, endDate, daysIWantToExclude } = this.get('context');
   *   if (date.isSame(startDate, 'day')) {
   *     return 'start-date';
   *   }
   *
   *   if (date.isSame(endDate, 'day')) {
   *     return 'end-date';
   *   }
   *
   *   if (daysIWantToExclude.includes(date.day())) {
   *     // don't add a class to these days
   *     return;
   *   }
   *
   *   return 'selected';
   * }
   * ```
   * @type {object}
   */
  context: null,

  /**
   * Max months to show
   * @type {number}
   */
  maxMonthsToShow: 6,

  /**
   * Offset for displayMonths
   * @private
   * @type {number}
   */
  monthOffset: 0,

  /**
   * Show the first of the month on that month
   * @example October 2017 - 1st is on Saturday. If this is true, October would include Sept 25 (if moment start of week locale is Monday)
   *          If false, this would show October 1st in the month of October since the majority of that week is in September
   * @todo this is commented out for now - this needs to be clearer how the user could pass this in
   * @type {boolean}
   */
  // showFirstDayOfMonth: false,

  _onDidReceiveAttrs: on('didReceiveAttrs', function() {
    // validate starDate and endDate are valid moment objects
    if (!moment.isMoment(this.get('startDate')) || !moment.isMoment(this.get('endDate'))) {
      this.setProperties({
        startDate: moment(this.get('startDate')),
        endDate: moment(this.get('endDate'))
      });
    }

    // validate validity of moments
    if (!this.get('startDate').isValid()) {
      throw new Error('Start date is invalid', this.get('startDate'));
    }

    if (!this.get('endDate').isValid()) {
      throw new Error('End date is invalid', this.get('endDate'));
    }

    // validate startDate is before endDate
    if (this.get('endDate').isBefore(this.get('startDate'))) {
      throw new Error('Start date must be before end date', this.get('startDate'), this.get('endDate'));
    }
  }),

  actions: {
    previous() {
      const currentOffset = this.get('monthOffset');
      this.set('monthOffset', currentOffset - this.get('maxMonthsToShow'));
    },

    next() {
      const currentOffset = this.get('monthOffset');
      this.set('monthOffset', currentOffset + this.get('maxMonthsToShow'));
    }
  },

  /**
   * Override this method in your code
   * @param {object} date - moment date
   * @return {string} class name to be applied to this date
   */
  customClassFunction(/*date*/) {
    return false;
  },

  /**
   * Don't show duplicate end of last month/beginning of this month
   * If endDate - startDate = 2 months, still display 3 months (pad one on end)
   * If endDate - startDate > 6 mo, display "next" and "previous"
   * @todo this doesn't work with 3/29/2017 and 4/16/2017
   * @type {array} array of months
   */
  displayMonths: computed('startDate', 'endDate', 'numberOfMonthsToDisplay', 'monthOffset', function() {
    var months = [];
    let current = moment(this.get('startDate')).add(this.get('monthOffset'), 'months');

    // if I enter 7/31/2017 (a Monday, so start of week) as startDate, that will be rendered in August since 8/1 is _not_ start of week. I shouldn't show July
    const firstWeekOfNextMonth = current.clone().add(1, 'month').startOf('month');
    if (current.isSame(firstWeekOfNextMonth, 'week')) {
      current.add(1, 'week');
    }

    for (let i = 0; i < this.get('numberOfMonthsToDisplay'); i++) {
      let showLastPartialWeek = false;
      let showFirstPartialWeek = false;

      // check if majority of first week is in this month or not
      const startOfThisMonth = moment(current).startOf('month');
      const startOfFirstWeek = moment(startOfThisMonth).startOf('week');
      if (startOfThisMonth.diff(startOfFirstWeek, 'days') > 3) {
        showFirstPartialWeek = false;
      }
      else {
        showFirstPartialWeek = true;
      }

      // check if majority of last week is in this month or not
      const endOfThisMonth = moment(current).endOf('month');
      const endOfLastWeek = moment(endOfThisMonth).endOf('week');
      if (endOfLastWeek.diff(endOfThisMonth, 'days') > 3) {
        showLastPartialWeek = false;
      }
      else {
        showLastPartialWeek = true;
      }

      if (i === 0) {
        // always show first week of first month
        showFirstPartialWeek = true;
      }

      if (i === this.get('numberOfMonthsToDisplay') - 1) {
        // always show last week of last month
        // I may want to change this to see if it's the month of endDate - this is showing up 2x in last month of pagination even if there are more months
        showLastPartialWeek = true;
      }

      months.addObject(Month.create({
        // current.month() is 0-indexed, but calendar-month expects 1-indexed month
        month: current.month(),
        year: current.year(),
        showLastPartialWeek,
        showFirstPartialWeek
      }));
      current.add(1, 'month');
    }

    return months;
  }),

  /**
   * T: first display month is after start date
   * F: first display month is same/before start date
   * @type {boolean}
   */
  shouldShowPreviousButton: computed('startDate', 'displayMonths.[]', function() {
    const firstMonth = this.get('displayMonths.firstObject.month');
    const firstMonthYear = this.get('displayMonths.firstObject.year');
    const firstDayOfFirstMonth = moment().month(firstMonth).year(firstMonthYear).startOf('month');
    return firstDayOfFirstMonth.isAfter(this.get('startDate'));
  }),

  /**
   * T: last display month is before end date
   * F: last display month is same/after end date
   * @type {boolean}
   */
  shouldShowNextButton: computed('endDate', 'displayMonths.[]', function() {
    const lastMonth = this.get('displayMonths.lastObject.month');
    const lastMonthYear = this.get('displayMonths.lastObject.year');
    const lastDayOfLastMonth = moment().month(lastMonth).year(lastMonthYear).endOf('month');
    return lastDayOfLastMonth.isBefore(this.get('endDate'));
  }),

  /**
   * The number of months between start and end date
   * @todo see if I can use something like `Math.ceil(endDate.diff(startDate, 'months', true))`
   * @type {number}
   */
  numberOfMonthsBetweenStartAndEndDate: computed('startDate', 'endDate', function() {
    const startDate = moment(this.get('startDate'));
    const endDate = moment(this.get('endDate'));
    let numMonths = 0;

    while (endDate.month() !== startDate.month() || endDate.year() !== startDate.year()) {
      numMonths++;
      startDate.add(1, 'month');
    }

    return numMonths;
  }),

  /**
   * The number of months to display
   * @type {number}
   */
  numberOfMonthsToDisplay: computed('startDate', 'endDate', 'maxMonthsToShow', function() {
    const numberOfMonthsBetweenStartAndEndDate = this.get('numberOfMonthsBetweenStartAndEndDate');
    const maxMonthsToShow = this.get('maxMonthsToShow');

    if (numberOfMonthsBetweenStartAndEndDate > maxMonthsToShow) {
      return maxMonthsToShow;
    }

    return numberOfMonthsBetweenStartAndEndDate + 1;
  })
});
