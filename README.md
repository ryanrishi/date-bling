# Date-bling

[![Build Status](https://travis-ci.org/ryanrishi/date-bling.svg?branch=master)](https://travis-ci.org/ryanrishi/date-bling)
[![npm version](https://badge.fury.io/js/datetime-bling.svg)](https://badge.fury.io/js/datetime-bling)

An [ember-cli](https://ember-cli.com/) addon to display calendar month(s).

## Usage
### Single month
```hbs
{{calendar-month
  month=currentMonth
  year=currentYear
  customClassFunction=oneMonthClassFunction}}
```

```js
currentMonth: null,
currentYear: null,

init() {
  this.set('currentMonth', moment().month());
  this.set('currentYear', moment().year());  
},

oneMonthClassFunction(date) {
  let selectedDays = [1, 2, 3, 5, 8, 13, 21];
    if (selectedDays.includes(date.date()) && moment().isSame(date, 'month')) {
      return 'selected';
    }
},
```

### Multiple months
```hbs
{{calendar-month-multi
  startDate=today
  endDate=threeMonthsFromNow
  context=(hash
    startDate=today
    endDate=threeMonthsFromNow
  )
  customClassFunction=threeMonthClassFunction}}
```

```js
today: null,
threeMonthsFromNow: null,

init() {
  this.set('today', moment().startOf('day'));
  this.set('threeMonthsFromNow', moment().startOf('day').add(2, 'months'));
},

threeMonthClassFunction(date) {
  // pass anything you will need anything into this function in 'context'
  const { startDate, endDate } = this.get('context');

  if (date.isSame(startDate, 'day')) {
    return 'start-date';
  }

  if (date.isSame(endDate, 'day')) {
    return 'end-date';
  }

  if (date.isBetween(startDate, endDate)) {
    return 'selected';
  }
}
```

## Installation

In your application's directory:
`ember install datetime-bling`

## Contributing
New features and bugfixes are welcome! Feel free to open a pull request.

## Running Tests
* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Copyright and License
Code and documentation &copy; Copyright 2017 Ryan Rishi. Code released under the [MIT License](LICENSE.md);
