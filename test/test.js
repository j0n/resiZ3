var r = require('../index');
var fs = require('fs');

var config = require('../config');
//var streamIn = fs.createReadStream('./image.png');
//var streamOut = fs.createWriteStream('./image240x240.png');
r.setConfig(config);
r.setStyle('middle', {folder: 'food' ,width: 20, height: 20});
r('./image.png','middle', function(err, url) {
  console.log('file uploaded to amazon', url);
});
r('./image.png',{style: 'middle', folder: 'tmp'}, function(err, url) {
  console.log('file uploaded to amazon', url);
});

