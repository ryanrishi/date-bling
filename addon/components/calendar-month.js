import Ember from 'ember';
import layout from '../templates/components/calendar-month';
import moment from 'moment';

const {
  computed
} = Ember;

const NOT_THIS_MONTH_CLASS = 'not-this-month';

var DisplayDate = Ember.Object.extend({
  date: -1,
  isThisMonth: false,
  customClass: null
});

function isPartialWeek(date) {
  Ember.debug('date', date, 'startOfweek', date.startOf('week'));
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

  month: moment().month(),
  monthName: computed('month', function() {
    return moment.months(/* respect locale*/true)[this.get('month')];
  }),
  weekdayNames: moment.weekdaysMin(/* respect locale */true),

  showMonthName: true,
  showWeekdayNames: true,
  showYear: true,
  year: moment().year(),
  notThisMonthClass: NOT_THIS_MONTH_CLASS,
  context: null,

  showLastPartialWeek: true,
  showFirstPartialWeek: true,
  showWeekNumbers: false,

  numberOfColumns: computed('showWeekNumbers', function() {
    return this.get('showWeekNumbers') ? 8 : 7;
  }),

  /**
   * @type {object} moment
   */
  canonicalFirstDayOfMonth: computed('month', 'year', function() {
    return moment().year(this.get('year')).month(this.get('month')).startOf('month');
  }),

  /**
   * Override this method in your code
   * @example start date and end date over multiple months - this component doesn't know anything about start/end dates (and shouldn't)
   * @param {object} date - moment date
   * @return {string} class name to be applied to this date
   */
  customClassFunction(/*date*/) {
    return false;
  },

  /**
   * The number of days in this month
   * @type {number}
   */
  numberOfDaysInMonth: computed('canonicalFirstDayOfMonth', function() {
    return moment(this.get('canonicalFirstDayOfMonth')).daysInMonth();
  }),

  /**
   * The number of weeks in this month
   * @type {number}
   */
  numberOfWeeksInMonth: computed('canonicalFirstDayOfMonth', 'month', function() {
    var first = moment(this.get('canonicalFirstDayOfMonth'));
    var numWeeks = 0;

    while (first.month() === this.get('month')) {
      numWeeks++;
      // set to start of week after initial loop to catch partial weeks at end of month
      first.add(1, 'week').startOf('week');
    }

    if (isPartialWeek(moment(this.get('canonicalFirstDayOfMonth')).endOf('month')) && this.get('showLastPartialWeek') === false) {
      numWeeks--;
    }

    return numWeeks;
  }),

  displayWeeks: computed('numberOfWeeksInMonth', 'canonicalFirstDayOfMonth', 'month', function() {
    var weeks = [];

    var first = moment(this.get('canonicalFirstDayOfMonth'));
    var current = first.startOf('week');

    for (let i = 0; i < this.get('numberOfWeeksInMonth'); i++) {
      if (i === 0 && this.get('showFirstPartialWeek') === false) {
        current.add(1, 'week');
        continue;
      }

      let days = [];
      // moment.week() is 0-indexed
      const weekNumber = current.week() + 1;
      for (let i = 0; i < 7; i++) {
        days.push(DisplayDate.create({
          date: current.date(),
          isThisMonth: this.get('month') === current.month(),
          // tdoo is this day, is this week, etc.
          customClass: this.get('customClassFunction').call(this, current)
        }));
        current.add(1, 'days');
      }

      weeks.push(Ember.Object.create({
        days,
        weekNumber
      }));
    }

    return weeks;
  })
});
