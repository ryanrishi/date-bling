import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('calendar-month-multi', 'Integration | Component | calendar month multi', {
  integration: true
});

test('it works when the start date is pushed to the first week of the next month', function(assert) {
  let startDate = '03/29/2017';
  let endDate = '04/16/2017';

  this.setProperties({ startDate, endDate });

  this.render(hbs`{{calendar-month-multi
                    startDate=startDate
                    endDate=endDate}}`);

  assert.equal(this.$('.previous').hasClass('hidden'), true, 'it does not show the previous button');
  assert.equal(this.$('.calendar-month').length, 1, 'it only renders one month');
});

test('it only shows two months if the start date is pushed to the first week of the next month', function(assert) {
  // this is kinda a confusing test title

  let startDate = '07/31/2017';
  let endDate = '09/14/2017';

  this.setProperties({ startDate, endDate });

  this.render(hbs`{{calendar-month-multi
                    startDate=startDate
                    endDate=endDate}}`);

  assert.equal(this.$('.calendar-month').length, 2, 'it only renders two months');
});

test('it shows two months', function(assert) {
  let startDate = '04/14/2017';
  let endDate = '05/14/2017';

  this.setProperties({ startDate, endDate });

  this.render(hbs`{{calendar-month-multi
                    startDate=startDate
                    endDate=endDate}}`);

  assert.equal(this.$('.calendar-month').length, 2, 'it renders two months');
});
