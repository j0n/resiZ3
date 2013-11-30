var r = require('../index');
var fs = require('fs');

var config = require('../config');
r.setConfig(config);
r.setStyle('middle', {folder: 'food' ,width: 20, height: 20});
r('./test/image.png',{width: 100, height: 100}, function(err, url) {
  console.log('file uploaded to amazon', url);
});
r('./test/image.png','middle', function(err, url) {
  console.log('file uploaded to amazon', url);
});
r('./test/image.png',{style: 'middle', folder: 'tmp'}, function(err, url) {
  console.log('file uploaded to amazon', url);
});
r('./test/image.JPG', {folder: 'test', width: 200, height: 200}, function(err, url) {
  console.log('file uploaded to amazon', url);
});

r.rawUpload('./test/image.png',{folder: 'tmp'}, function(err, url) {
  console.log('file uploaded to amazon', url);
});
