var knox = require('knox'),
    http = require('http'),
    path = require('path'),
    mime = require('mime'),
    config = require('./config'),
    gm = require('gm').subClass({ imageMagick: true }),
    fs = require('fs');


var resizeAndUp = function(config) {
  console.log(config);
  this.client = knox.createClient({
    key: config.s3.key
  , secret: config.s3.secret
  , bucket: config.s3.bucket
  , endpoint: config.s3.endpoint
  });
}
resizeAndUp.prototype.resize = function(file, options,callback) {
  var tmp = './'+Math.round(new Date().getTime())
  gm(file).resize(options.width,options.height).write(tmp, function(err) {
    callback(tmp);
  })
};
resizeAndUp.prototype.upload = function(file, options, callback) {
  fs.exists(file, function(e) {
    console.log(e);
  })
  fs.stat(file, function(err, stats) {
    console.log(stats);
    var headers = {
      'x-amz-acl': 'public-read',
      'Content-Length': stats.size,
      'Content-Type': options.type 
    };
    var streamIn = fs.createReadStream(file);
    var s3url = '/test/'+Math.round(new Date().getTime())+'-'+options.height+'x'+options.width+options.ext;
    var r = this.client.putStream(streamIn, s3url, headers, function(err) {
      if (err) { return callback(err) }
      fs.unlink(file);
      callback(null, r.url)
    })
  }.bind(this))
}

module.exports = function(file, callback) {
  console.log('hej');
  var r = new resizeAndUp();
  var extension =  path.extname(file);
  var contentType = mime.lookup(file);
  var options = {
    ext: path.extname(file),
    contentType: mime.lookup(file),
    width: 10,
    height: 10
  }

  r.resize(file, options,  function(filename) {
    r.upload(filename, options, callback)
  })
}
