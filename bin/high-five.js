#!/usr/bin/env node

var request = require('request')
var argv = require('minimist')(process.argv.slice(2))
var config = require('rc')('high-five', {
  workshops: [
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
  ],
  registry: 'http://high-five-registry.nodeschool.io'
})
var last = require('../lib/last')

if (argv.v || argv.version) {
  return console.log(require('../package.json').version)
}

config.registry = argv.r || argv.registry || config.registry

last.completedExercise(config.workshops, function (er, data) {
  if (er) throw er

  request.post({url: config.registry, body: data, json: true}, function (er) {
    if (er) {
      return console.error('Failed to register completed exercise', config.registry, data, er)
    }
  })
})

