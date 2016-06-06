var _ = require('lodash')
var Parse = require('parse/node')
var Store = require('../data/Store')
var DummyData = require('../data/DummyData')
var Trigger = Parse.Object.extend("Trigger")
var Helpers = require('./helpers')
var useMasterKey = {useMasterKey: true}

function loadTriggers(options, callback) {
  var query = new Parse.Query(Trigger)
  query.limit = 1000

  query.find({
    useMasterKey: true,
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

function storeTriggers(newTriggers) {
  if (!Array.isArray(newTriggers))
    newTriggers = [newTriggers]
  Store.triggers = _.unionBy(Store.triggers, newTriggers, 'id')
}

function createTriggers(parentForm) {
  var newTrigger = new Trigger()
  newTrigger.set('triggerType', DummyData.trigger.triggerType)
  newTrigger.set('properties', DummyData.trigger.properties)
  newTrigger.set('form', parentForm)
  newTrigger.save(null, {
    success: function(response) {
      if (parentForm) {
        var relation = parentForm.relation('triggers')
        relation.add(newTrigger)
        parentForm.save(null, useMasterKey)
      }
      storeTriggers(response)
    },
    error: function(response, error) {
      console.warn('Failed to create Trigger, with error code: ' + error.message)
    }
  })
}

function createDemoTrigger(parentForm, when) {
  var newTrigger = new Trigger()
  Helpers.setAdminACL(newTrigger).then(function() {
    newTrigger.set('type', 'datetime')
    newTrigger.set('properties', {"datetime": when.toISOString()})
    newTrigger.set('form', parentForm)

    newTrigger.save(null, {
      useMasterKey: true,
      success: function(response) {
          if (parentForm) {
            var relation = parentForm.relation('triggers')
            relation.add(newTrigger)
            parentForm.save(null, useMasterKey)
          }
          storeTriggers(response)
        },
        error: function(response, error) {
          console.warn('Failed to create Trigger, with error code: ' + error.message)
        }
    })
  })
}

module.exports = { Trigger, loadTriggers, createTriggers, storeTriggers, createDemoTrigger }
