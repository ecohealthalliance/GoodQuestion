var Settings = require('../../js/settings')
var DemoData = require('../data/DemoData')
var Parse = require('parse/node')
var Roles= require('./Roles')
var useMasterKey = {useMasterKey: true}
var colors = require('colors')
var helpers = require('./helpers')

function createInitialAdmin(){
  console.log('\nCreating initial admin user...'.bold);
  adminUser = new Parse.User()
  adminUser.set("username", Settings.users[0].user)
  adminUser.set("password", Settings.users[0].pass)
  adminUser.set("email", Settings.users[0].user)
  return adminUser.signUp(null)
    .then(function(newAdminUser){
      return Roles.getRole('admin')
    })
    .then(function(adminRole){
      adminRole.getUsers().add(adminUser)
      return adminRole.save(null, useMasterKey)
    })
    .then(function(){
      console.log('Initial admin user created'.green);
    })
    .fail(function(err){
      console.log('Initial admin user already exists'.yellow);
    })
}

function createUsers (users) {
  console.log('\nCreating initial users...'.bold);
  return new Promise(function(resolve){
    DemoData.users.regularUsers.forEach(function(user, i, users){
      newUser = new Parse.User()
      newUser.set("username", user.userName)
      newUser.set("password", user.pass)
      newUser.set("email", user.userName)
      newUser.set("role", 'user')
      newUser.signUp(null, useMasterKey)
        .then(function(){
          if (i === users.length-1) resolve()
        })
        .fail(function(err){
          console.log(colors.yellow(user.userName+' already exists'));
        })
    })
  })
}

function addExistingAdminsToRole(){
  var adminRole
  Roles.getRole('admin')
    .then(function(adminRole){
      adminRole = adminRole
      getAdminUsers()
    })
    .then(function(users){
      users.forEach(function(user){
        adminRole.relation("users").add(adminUser)
        adminRole.save()
      })
    })
    .then(function(){
      setRoleACLs()
    })
}

function getAdminUsers(){
  var query = new Parse.Query(Parse.User)
  query.equalTo('role', 'admin')
  query.find(useMasterKey)
    .then(function(adminUsers){
      return adminUsers
    })
}

function setAdminRoleACLs() {
  Roles.getRole('admin')
    .then(function(adminRole) {
      var query = new Parse.Query(Parse.Role)
      query.find(useMasterKey)
        .then(function(roles) {
          roles.forEach(function(role){
            acl = role.getACL()
            acl.setReadAccess(adminRole, true)
            acl.setWriteAccess(adminRole, true)
            role.setACL(acl)
                .save(null, useMasterKey)
          })
        })
    })
}

function loadUsers() {
  query = new Parse.Query(Parse.User)
  return query.find(useMasterKey).then(function(users){
    return users
  })
}

function destroyAll() {
  loadUsers().then(function(users){
    if (users)
      helpers.destroyObjects(users, 'Users')
  })
}

module.exports = { createInitialAdmin, loadUsers, createUsers, destroyAll }
