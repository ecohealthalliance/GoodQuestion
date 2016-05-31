var _ = require('lodash')
var Parse = require('parse/node')
var Store = require('../data/Store')

function loadRoles(options, callback) {
  var Role = Parse.Role
  var query = new Parse.Query(Role)
  query.limit = 1000

  query.find({
    success: function(results) {
      storeRoles(results)
      if (callback)
        callback(null, results)
    },
    error: function(error, results) {
      console.warn("Error: " + error.code + " " + error.message)
      if (callback)
        callback(error, results)
    }
  })
}

function createRoles(parseRoles) {
  if (parseRoles.length)
    return;

  var roleACL = new Parse.ACL();
  roleACL.setPublicReadAccess(true);
  var role = new Parse.Role("admin", roleACL);
  role.save(null, {
    success: function(response) {
      storeRoles(response)
      if (callback)
        callback(null, results)
    },
    error: function(response, error) {
      console.warn('Failed to create Form, with error code: ' + error.message)
      if (callback)
        callback(error, results)
    }
  })
}

function storeRoles(newRoles) {
  if (!Array.isArray(newRoles))
    newRoles = [newRoles]
  Store.roles = _.unionBy(Store.roles, newRoles, 'id')
}

module.exports = { loadRoles, createRoles }
