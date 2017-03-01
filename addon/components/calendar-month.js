import Ember from 'ember';
import layout from '../templates/components/calendar-month';

const {
  computed
} = Ember;

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAY_NAMES = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const SELECTED_CLASS = 'selected';

var DisplayDate = Ember.Object.extend({
  date: -1,
  isSelected: false,
  isThisMonth: false,
});

export default Ember.Component.extend({
  layout,
  classNames: ['calendar-month'],

  month: 2,
  monthNames: MONTH_NAMES,
  monthName: computed('month', function() {
    return this.get('monthNames')[this.get('month')];
  }),
  weekdayNames: WEEKDAY_NAMES,
  year: 2017,

  showMonthName: true,
  showWeekdayNames: true,
  selectedDays: [14],
  selectedClass: SELECTED_CLASS,

  /**
   * @type {[type]}
   */
  canonicalFirstDayOfMonth: computed('month', 'year', function() {
    return moment().year(this.get('year')).month(this.get('month')).startOf('month');
  }),


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

  numberOfWeeksInMonth: computed('canonicalFirstDayOfMonth', function() {
    var first = moment(this.get('canonicalFirstDayOfMonth'));
    var numWeeks = 0;

    // while (first.week() !== 0) {
    //   debugger
    //   numWeeks++;
    //   first = first.add(1, 'week');
    // }

    // return numWeeks;
    return 5;
  }),

  displayWeeks: computed('numberOfWeeksInMonth', 'canonicalFirstDayOfMonth', 'selectedDays', 'month', function() {
    var weeks = [];

    var first = moment(this.get('canonicalFirstDayOfMonth'));
    var current = first.startOf('week');

    for (let i = 0; i < this.get('numberOfWeeksInMonth'); i++) {
      let days = [];
      for (let i = 0; i < 7; i++) {
        days.push(DisplayDate.create({
          date: current.date(),
          isSelected: this.get('selectedDays').contains(current.date()),
          isThisMonth: this.get('month') === current.month()
        }));
        current = current.add(1, 'days');
      }
      weeks.push(days);
    }

    return weeks;
  })
});
