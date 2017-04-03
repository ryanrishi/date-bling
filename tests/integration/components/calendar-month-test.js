import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('calendar-month', 'Integration | Component | calendar month', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{calendar-month
    month=2
    year=2017
    showMonthName=true
    showYear=false}}`);

  assert.equal(this.$('thead .month-name').text().trim(), 'March');
});
