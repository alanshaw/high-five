var test = require('tape')
var last = require('../lib/last')

test('should throw if no workshops passed', function (t) {
  t.plan(2)

  t.throws(function () {
    last.completedExercise(null)
  }, 'passing not array should throw')

  t.throws(function () {
    last.completedExercise([])
  }, 'passing empty array should throw')

  t.end()
})