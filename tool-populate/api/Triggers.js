var _ = require('lodash')
var Parse = require('parse/node')
var DemoGeofenceData = require('../data/DemoGeofenceData')
var Trigger = Parse.Object.extend("Trigger")
var Users = require('./Users')
var Helpers = require('./Helpers')
var useMasterKey = {useMasterKey: true}

function loadTriggers(options, callback) {
  Helpers.fetchObjects(Trigger, callback)
}

function createDemoTrigger(parentForm, when) {
  var newTrigger = new Trigger()
  newTrigger.set('type', 'datetime')
  newTrigger.set('properties', {"datetime": when.toISOString()})
  newTrigger.set('form', parentForm)
  newTrigger.save(null, useMasterKey)
    .then(function(newTrigger) {
      if (parentForm) {
        var relation = parentForm.relation('triggers')
        relation.add(newTrigger)
        parentForm.save(null, useMasterKey)
      }
    })
    .then(function(){
      return Users.setUserRights(newTrigger)
    })
    .fail(function(response, error) {
      console.warn('Failed to create Trigger, with error code: ' + error.message)
    })
}

function destroyAll() {
  loadTriggers(null, function(err, triggers){
    if (triggers)
      Helpers.destroyObjects(triggers, 'Triggers')
  })
}

function createDemoGeofenceTrigger(parentForm, geofence) {
  var data = DemoGeofenceData.geofence[ parentForm.get('order') - 1 ]
  var newTrigger = new Trigger()

  newTrigger.set('type', 'geofence')
  newTrigger.set('properties', data)
  newTrigger.set('form', parentForm)

  newTrigger.save(null, useMasterKey)
    .then(function(newTrigger) {
      if (parentForm) {
        var relation = parentForm.relation('triggers')
        relation.add(newTrigger)
        parentForm.save(null, useMasterKey)
      }
    })
    .then(function(){
      return Users.setUserRights(newTrigger)
    })
    .fail(function(response, error) {
      console.warn('Failed to create Trigger, with error code: ' + error.message)
    })
}

module.exports = { Trigger, loadTriggers, createDemoTrigger, destroyAll, createDemoGeofenceTrigger }
