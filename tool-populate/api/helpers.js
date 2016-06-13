var Parse = require('parse/node')
var useMasterKey = {useMasterKey: true}
var Roles = require('./Roles')

/*
  Accepts Parse object and sets ACL giving users in Admin Role read/write access
  @param [Object] obj, Parse object on which to modify ACL
 */
function setAdminACL(obj) {
  Roles.getRole('admin')
    .then(function(adminRole) {
      var acl = new Parse.ACL()
      acl.setPublicReadAccess(false)
      acl.setPublicWriteAccess(false)
      acl.setReadAccess(adminRole, true)
      acl.setWriteAccess(adminRole, true)
      obj.setACL(acl)
      return obj
    })
    .fail(function(err){console.log(err);})
}


module.exports = { setAdminACL }
