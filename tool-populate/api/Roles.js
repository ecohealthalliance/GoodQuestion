var _ = require('lodash')
var Parse = require('parse/node')
var Store = require('../data/Store')
var Helpers = require('./helpers')

function loadRoles(options, callback) {
  var Role = Parse.Role
  var query = new Parse.Query(Role)
  query.limit = 1000

  query.find({
    useMasterKey: true,
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

function createRole(roleToCreate) {
  var acl = new Parse.ACL()
  acl.setPublicReadAccess(true)
  var role = new Parse.Role(roleToCreate, acl)
  console.log('Creating role "' + roleToCreate + '"')
  return role.save(null, {
    useMasterKey: true,
    success: function(response) {
      storeRoles(response)
      console.log('Created role "' + roleToCreate + '"')
    },
    error: function(response, error) {
      console.warn('Failed to create Role, with error code: ' + error.message)
    }
  })
}

function storeRoles(newRoles) {
  if (!Array.isArray(newRoles))
    newRoles = [newRoles]
  Store.roles = _.unionBy(Store.roles, newRoles, 'id')
}

module.exports = { loadRoles, createRole }
