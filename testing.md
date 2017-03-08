### general
- set `endDate` before `startDate`
- set `month` to something silly like 21 and `year` to -82
- 0-indexed vs 1-indexed months (0 or 12)

### moment
- change locales
  - make sure weekday names and month names are correct
- change first day of month
  - make sure that weeks still render correctly
- test different date formats (canonical, moment, js date, timestamp)
  
### pagination
- set `startDate` and `endDate` several years apart and change `maxMonthsToShow`
- change `maxMonthsToShow` to some small number
