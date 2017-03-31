import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('calendar-month-multi', 'Integration | Component | calendar month multi', {
  integration: true
});

test('it works when the start date is pushed to the first week of the next month', function(assert) {
  assert.ok(true);
});

test('it does not show the previous button if the start date is at the end of a previous month', function(assert) {
  let component = this.subject();

  let startDate = '03/29/2017';
  let endDate = '04/16/2017';

  component.setProperties({ startDate, endDate });

  this.render(hbs`{{calendar-month-multi}}`);

  assert.equal(this.$('.previous').text().trim(), '');
});
