var fs = require('fs')
var path = require('path')

function lastCompletedExercise (workshops, cb) {
  if (!Array.isArray(workshops)) throw new TypeError('Expected array of workshops')
  if (!workshops.length) throw new Error('No workshops!')

  var pending = workshops.length
  var last = null

  workshops.forEach(function (workshop) {
    fs.stat(completedPath(workshop), function (er, stats) {
      if (er) return done()

      lastExercise(workshop, function (er, name) {
        if (er || !name) return done()

        if (!last || last.completedAt < stats.mtime) {
          last = {
            name: name,
            workshop: workshop,
            completedAt: stats.mtime.getTime()
          }
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

module.exports.completedExercise = lastCompletedExercise

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