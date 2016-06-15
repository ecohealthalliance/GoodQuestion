var _ = require('lodash')
var Parse = require('parse/node')
var Helpers = require('./Helpers')
var Users = require('./Users')
var useMasterKey = {useMasterKey: true}
var colors = require('colors')

function loadRoles (options, callback) {
  Helpers.fetchObjects(Parse.Role, callback)
}

function createRole(roleToCreate) {
  var acl= new Parse.ACL()
  var role = new Parse.Role(roleToCreate, acl)
  return role.save(useMasterKey)
    .then(function(role){
      console.log(colors.green('Created role "' + roleToCreate + '"'))
    })
    .fail(function(error) {
      console.log(colors.red('Failed to create Role, with error code: ' + error.message))
    })
}

function getRole(name) {
  query = new Parse.Query(Parse.Role)
  query.equalTo('name', name)
  return query.first(useMasterKey)
    .then(function(role){
      return role
    })
}

function setRoleACLs() {
  var query = new Parse.Query(Parse.Role)
  query.find(useMasterKey)
    .then(function(roles){
      adminRole = _.find(roles, function(role){
        return role.get('name') === 'admin'
      })
      _.each(roles, function(role){
        var acl = new Parse.ACL()
        acl.setPublicReadAccess(true)
        acl.setReadAccess(adminRole, true)
        acl.setWriteAccess(adminRole, true)
        role.setACL(acl)
        role.save(null, useMasterKey)
      })
    })
}

module.exports = { loadRoles, createRole, getRole, setRoleACLs }
