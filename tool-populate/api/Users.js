var Settings = require('../../js/settings')
var DemoData = require('../data/DemoData')
var Parse = require('parse/node')
var Roles = require('./Roles')
var useMasterKey = {useMasterKey: true}
var colors = require('colors')
var Helpers = require('./Helpers')

function createInitialAdmin(){
  console.log('\nCreating initial admin user...'.bold);
  adminUser = new Parse.User()
  adminUser.set("username", Settings.users[0].user)
  adminUser.set("password", Settings.users[0].pass)
  adminUser.set("email", Settings.users[0].user)
  return adminUser.signUp(null)
    .then(setAdminACL)
    .then(function(adminUser){
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
      newUser.signUp(null, useMasterKey)
        .then(setAdminACL)
        .then(function(){
          if (i === users.length-1) resolve()
        })
        .fail(function(err){
          console.log(colors.yellow(user.userName+' already exists'));
        })
      })
  })
}

function addUsersToACL(obj) {
  var acl
  acl = obj.getACL() || new Parse.ACL()
  return new Promise(function(resolve){
    loadUsers().then(function(users){
      users.forEach(function(user, i, users){
        setUserACL(obj, user).then(function(){
          if (i === users.length - 1)
            resolve()
        }).fail(function(err){console.log(err)})
      })
    })
  })
}

function setAdminACL(obj) {
  return Roles.getRole('admin')
    .then(function(adminRole) {
      acl = obj.getACL() || new Parse.ACL()
      acl.setReadAccess(adminRole, true)
      acl.setWriteAccess(adminRole, true)
      obj.setACL(acl)
      return obj.save(null, useMasterKey).then(function(obj){
        return obj
      })
    })
    .fail(function(err){console.log(err);})
}

function setUserACL(obj, user) {
  var acl
  acl = obj.getACL() || new Parse.ACL()
  acl.setReadAccess(user, true)
  obj.setACL(acl)
  return obj.save(null, useMasterKey).then(function(obj){
    return obj
  })
}

function setUserRights(obj) {
  return setAdminACL(obj).then(addUsersToACL)
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
      Helpers.destroyObjects(users, 'Users')
  })
}

module.exports = { createInitialAdmin, loadUsers, createUsers, destroyAll, addUsersToACL, setUserRights, setAdminACL, setUserACL }
