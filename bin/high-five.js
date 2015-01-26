#!/usr/bin/env node

var fs = require('fs')
var path = require('path')

lastCompletedExercise([
  'javascripting',
  'learnyounode',
  'git-it',
  'stream-adventure',
  'functional-javascript-workshop',
  'shader-school',
  'levelmeup',
  'bytewiser',
  'expressworks',
  'bug-clinic',
  'makemehapi',
  'browserify-adventure',
  'promise-it-wont-hurt',
  'introtowebgl',
  'async-you',
  'count-to-6',
  'nodebot-workshop',
  'kick-off-koa',
  'goingnative',
  'lololodash',
  'planetproto',
  'learnyoucouchdb',
  'webgl-workshop',
  'learnuv'
], function (er, last) {
  if (er) throw er
  console.log('HIGH FIVE, YOU COMPLETED', last.exercise, 'ON', last.mtime)
})

function lastCompletedExercise (workshops, cb) {
  if (!workshops.length) throw new Error('No workshops!')

  var pending = workshops.length
  var last = null

  workshops.forEach(function (workshop) {
    fs.stat(completedPath(workshop), function (er, stats) {
      if (er) return done()

      lastExercise(workshop, function (er, exercise) {
        if (er || !exercise) return done()

        if (last) {
          if (last.mtime.getTime() < stats.mtime.getTime()) {
            last = {exercise: exercise, mtime: stats.mtime}
          }
        } else {
          last = {exercise: exercise, mtime: stats.mtime}
        }

        done()
      })
    })
  })

  function done () {
    pending--
    if (pending) return
    if (!last) return cb(new Error('No exercises completed'))
    cb(null, last)
  }
}

function lastExercise (workshop, cb) {
  fs.readFile(completedPath(workshop), 'utf8', function (er, json) {
    if (er) return cb(er)
    try {
      var list = JSON.parse(json)
      cb(null, list[list.length - 1])
    } catch (er) {
      cb(er)
    }
  })
}

function completedPath (workshop) {
  return path.resolve(
    process.env.HOME || process.env.USERPROFILE,
    '.config/' + workshop + '/completed.json'
  )
}

