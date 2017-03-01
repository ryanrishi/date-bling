import Ember from 'ember';

export function isFirstDayOfWeek(params/*, hash*/) {
  return moment(params[0]).day() === 0;
}

export default Ember.Helper.helper(isFirstDayOfWeek);
