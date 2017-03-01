import Ember from 'ember';
import layout from '../templates/components/calendar-month';

const {
  computed
} = Ember;

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAY_NAMES = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const SELECTED_CLASS = 'selected';

var DisplayDate = Ember.Object.extend({
  day: 0,
  isSelected: false,
  isFirstDayOfWeek: false,
});

export default Ember.Component.extend({
  layout,
  classNames: ['calendar-month'],

  month: 2,
  monthNames: MONTH_NAMES,
  monthName: computed('month', function() {
    // todo return value from const array
    return this.get('monthNames')[this.get('month')];
  }),
  weekdayNames: WEEKDAY_NAMES,
  year: 2017,

  showMonthName: true,
  showWeekdayNames: true,
  selectedDays: [14],
  selectedClass: SELECTED_CLASS,

  // displayDays: computed('selectedDays', function() {
  //   var days = [];
  //   for (let i = 0; i < this.get('numberOfDaysInMonth'); i++) {
  //     var day = DisplayDate.create({
  //       day: i,
  //       isSelected: this.get('selectedDays').contains(i),
  //       isFirstDayOfWeek: (moment(`${this.get('year')}-${this.get('month')}-${i}`).day() === 0)
  //     });
  //     days.push(day);
  //   }
  //
  //   return days;
  // }),

  /**
   * @todo use `moment.startOf('month')`
   * @type {[type]}
   */
  canonicalFirstDayOfMonth: computed('month', 'year', function() {
    return moment().year(this.get('year')).month(this.get('month')).date(1);
    // return moment(`${this.get('year')}-${this.get('month')}-01`).format('YYYY-MM-DD');
  }),

  // firstOfMonthWeekday: computed('canonicalFirstDayOfMonth', function() {
  //   var canonicalFirstDayOfMonth = this.get('canonicalFirstDayOfMonth');
  //
  //   return moment(canonicalFirstDayOfMonth).day();
  // }),

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
    // var first = moment(this.get('canonicalFirstDayOfMonth'));
    // var numDays = 0;
    //
    // // months are 1-indexed
    // while ((first.month() + 1) % 12 === this.get('month')) {
    //   numDays++;
    //   first = first.add(1, 'days');
    // }
    //
    // // first is now into next month
    // return numDays;
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
        days.push(Ember.Object.create({
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
