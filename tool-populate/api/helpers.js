var Parse = require('parse/node')
/*
  Accepts Parse object and sets ACL giving users in Admin Role read/write access
  @param [Object] obj, Parse object on which to modify ACL
 */
function setAdminACL(obj) {
  var query = new Parse.Query(Parse.Role)
  query.equalTo('name', 'admin')
  return query.first({useMasterKey: true})
    .then(function(adminRole) {
      var acl = new Parse.ACL()
      acl.setPublicReadAccess(false)
      acl.setPublicWriteAccess(false)
      acl.setReadAccess(adminRole, true)
      acl.setWriteAccess(adminRole, true)
      obj.setACL(acl)
    })
}

module.exports = { setAdminACL }
