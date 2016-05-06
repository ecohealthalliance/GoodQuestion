var _ = require('lodash')
var Parse = require('parse/node')
var Store = require('../data/Store')
var DummyData = require('../data/DummyData')


function loadTriggers(options, callback) {
  var Trigger = Parse.Object.extend("Trigger")
  var query = new Parse.Query(Trigger)
  query.limit = 1000

  query.find({
    success: function(results) {
      storeTriggers(results)
      if (callback) callback(null, results)
    },
    error: function(error, results) {
      console.warn("Error: " + error.code + " " + error.message)
      if (callback) callback(error, results)
    }
  })
}

function createTriggers(parentForm) {
  var Trigger = Parse.Object.extend('Trigger')
  var newTrigger = new Trigger()

  newTrigger.set('triggerType', DummyData.trigger.triggerType)
  newTrigger.set('properties', DummyData.trigger.properties)
  newTrigger.set('form', parentForm)

  newTrigger.save(null, {
    success: function(response) {
        if (parentForm) {
          var relation = parentForm.relation('triggers')
          relation.add(newTrigger)
        }
        storeTriggers(response)
      },
      error: function(response, error) {
        console.warn('Failed to create Trigger, with error code: ' + error.message)
      }
    })
}

function storeTriggers(newTriggers) {
  if (!Array.isArray(newTriggers)) newTriggers = [newTriggers]
  Store.triggers = _.unionBy(Store.triggers, newTriggers, 'id')
}

module.exports = { loadTriggers, createTriggers, storeTriggers }