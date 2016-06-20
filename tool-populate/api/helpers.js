var Parse = require('parse/node')
var colors = require('colors')
var useMasterKey = {useMasterKey: true}

function destroyObjects(objs, objString){
  objs.forEach(function(obj){
    obj.destroy(useMasterKey)
  })
  console.log(colors.red(objString+' deleted'));
}

function fetchObjects(subClass, callback) {
  var query = new Parse.Query(subClass)
  query.limit = 1000
  query.find(useMasterKey)
    .then(function(objs){
      callback(null, objs)
    })
    .fail(function(error, objs) {
      console.warn("Error: " + error.code + " " + error.message)
      if (callback) callback(error, objs)
    })
}

module.exports = { destroyObjects, fetchObjects }
