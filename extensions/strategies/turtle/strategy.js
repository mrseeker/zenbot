var z = require('zero-fill'),
  n = require('numbro'),
  highest = require('../../../lib/highest'),
  lowest = require('../../../lib/lowest')

module.exports = {
  name: 'turtle',
  description: 'Turtle Strategy',

  getOptions: function () {
    this.option('period_length', 'period length', String, '15m')
    this.option('min_periods', 'min periods', Number, 50)
    this.option('enter_fast', 'Entry Fast', Number, 20)
    this.option('exit_fast', 'Exit Fast', Number, 10)
    this.option('enter_slow', 'Entry Slow', Number, 55)
    this.option('exit_slow', 'Exit Slow', Number, 20)
  },

  calculate: function (s) {
    if (s.lookback[s.options.min_periods]) {
      //Fast
      highest(s,'fastL',s.options.enter_fast)
      lowest(s,'fastLC',s.options.exit_fast)
      lowest(s,'fastS',s.options.enter_fast)
      highest(s,'fastSC',s.options.exit_fast)
      
      //Slow
      highest(s,'slowL',s.options.enter_slow)
      lowest(s,'slowLC',s.options.exit_slow)
      lowest(s,'slowS',s.options.enter_slow)
      highest(s,'slowSC',s.options.exit_slow)
      
    }
  },

  onPeriod: function (s, cb) {
    if (s.lookback[s.options.min_periods]) {
      if (s.period.high > s.lookback[1].fastL || s.period.high > s.lookback[1].slowL) {
        if (s.trend != 'up')
        {
          s.signal = 'buy'
        }
        s.trend = 'up'
      }
      if (s.period.low <= s.lookback[1].fastLC || s.period.low <= s.lookback[1].slowLC) {
        if (s.trend != 'down')
        {
          s.signal = 'sell'
        }
        s.trend = 'down'
      }
      if (s.period.low <= s.lookback[1].fastS || s.period.low <= s.lookback[1].slowS) {
        if (s.trend != 'down')
        {
          s.signal = 'sell'
        }
        s.trend = 'down'
      }

    }

    cb()
  },

  onReport: function (s) {
    var cols = []
    if (s.lookback[s.options.min_periods]) {
      var color = 'grey'
      if (s.trend === 'up') {
        color = 'green'
      }
      else if (s.trend === 'down') {
        color = 'red'
      }

      cols.push(z(8, n(s.period.close).format('000'), ' ')[color])
    }
    return cols
  }
}