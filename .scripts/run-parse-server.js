#!/usr/bin/env node

'use strict'

var Settings = require('./../js/settings.js')

var port = 1337

var express = require('express')
var ParseServer = require('parse-server').ParseServer

console.log('Initiating local parse server instance on port ' + port)

var app = express();
var api = new ParseServer({
  databaseURI: 'mongodb://localhost:13001/meteor',
  appId: Settings.parse.appId,
  masterKey: Settings.parse.masterKey,
  serverURL: Settings.parse.serverUrl
})

// Serve the Parse API at /parse URL prefix
app.use('/parse', api)

// CORS
app.use(function(mountPath, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  return next()
})

app.listen(port, function() {
  console.log('Local parse server instance is running on port ' + port)
  console.log('\nThe command to start parse-dashboard:')
  console.log('parse-dashboard --appId ' + Settings.parse.appId + ' \\')
  console.log('                --masterKey "' + Settings.parse.masterKey + '" \\')
  console.log('                --serverURL "' + Settings.parse.serverUrl + '" \\')
  console.log('                --appName ' + Settings.parse.appName)
})
