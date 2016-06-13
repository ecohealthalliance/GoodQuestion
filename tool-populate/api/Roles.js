var _ = require('lodash')
var Parse = require('parse/node')
var Store = require('../data/Store')
var Helpers = require('./helpers')
var useMasterKey = {useMasterKey: true}
var colors = require('colors')

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

function createRole(roleToCreate) {
  var roleACL = new Parse.ACL();
  roleACL.setPublicReadAccess(true);

  var role = new Parse.Role(roleToCreate, roleACL);
  return role.save(null, {
    success: function(response) {
      console.log(colors.green('Created role "' + roleToCreate + '"'))
    },
    error: function(response, error) {
      console.log(colors.red('Failed to create Role, with error code: ' + error.message))
    }
  })
}

function getRole(name) {
  query = new Parse.Query(Parse.Role)
  query.equalTo('name', name)
  return query.first(useMasterKey).then(function(role){
      return role
    })
}
module.exports = { loadRoles, createRole, getRole }
