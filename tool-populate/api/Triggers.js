var _ = require('lodash')
var Parse = require('parse/node')
var Trigger = Parse.Object.extend("Trigger")
var helpers = require('./helpers')
var useMasterKey = {useMasterKey: true}

function loadTriggers(options, callback) {
  var query = new Parse.Query(Trigger)
  query.limit = 1000

  query.find({
    success: function(results) {
      if (callback) callback(null, results)
    },
    error: function(error, results) {
      console.warn("Error: " + error.code + " " + error.message)
      if (callback) callback(error, results)
    }
  })
}

function createDemoTrigger(parentForm, when) {
  var newTrigger = new Trigger()
  helpers.setAdminACL(newTrigger).then(function(newTrigger) {
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
        storeTriggers(response)
      },
      error: function(response, error) {
        console.warn('Failed to create Trigger, with error code: ' + error.message)
      }
    })
}

function destroyAll() {
  loadTriggers(null, function(err, triggers){
    if (triggers)
      helpers.destroyObjects(triggers, 'Triggers')
  })
}

module.exports = { Trigger, loadTriggers, createDemoTrigger, destroyAll }
