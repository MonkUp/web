// API Router
var config = require('../config');
var path = require('path');
var firebase = require('firebase');
var express = require('express');
var router = express.Router();//gs://protodraw-c64e7.appspot.com/
var fs = require('fs');

firebase.initializeApp({
  serviceAccount: path.join(__dirname, '..', config.FIREBASE_CREDENTIALS_PATH),
  databaseURL: config.FIREBASE_URL
});

var firebaseAppsRef = firebase.database().ref('apps');

router.get('/:username/:appName', function(req, res) {
  firebaseAppsRef.once('value', function(appsDataSnapshot) {
    var apps = appsDataSnapshot.val();
    console.log(JSON.stringify(apps));
    for(var key in apps) {
      if(apps[key].username == req.params.username && apps[key].appName == req.params.appName) {
        res.json(apps[key]);
        return;
      }
    }
    res.sendStatus(404);
  });
});

router.post('/appData/', function(req, res){
  var data = req.body;
  console.log(req.body);
  firebaseAppsRef.push(data);
  res.sendStatus(200);
});

router.post('/image/:username/:appName/:viewName', function(req, res){
  console.log('got image post');
  //console.log(req.body);
  fs.writeFile(__dirname+"/images/"+req.params.username+'-'+req.params.appName+'-'+req.params.viewName+'.png', new Buffer(req.body.data, "base64"), function(err) {
    res.sendStatus(200);
  });
});



module.exports = router;