var knox = require('knox'),
    path = require('path'),
    mime = require('mime'),
    Q = require('q'),
    gm = require('gm').subClass({ imageMagick: true }),
    fs = require('fs');

var config = {};
var styles = {};


var resiZ3 = function() {
  this.client = knox.createClient({
    key: config.s3.key
  , secret: config.s3.secret
  , bucket: config.s3.bucket
  , endpoint: config.s3.endpoint
  });
}
resiZ3.prototype.resize = function(file, options,callback) {
  var tmp = './'+Math.round(new Date().getTime())
  gm(file).resize(options.width,options.height).write(tmp, function(err) {
    callback(err, tmp);
  })
};
resiZ3.prototype.upload = function(file, options, callback) {
  fs.stat(file, function(err, stats) {
    var headers = {
      'x-amz-acl': 'public-read',
      'Content-Length': stats.size,
      'Content-Type': options.type
    };
    var streamIn = fs.createReadStream(file);
    var s3url = options.folder+Math.round(new Date().getTime());
    if (options.width && options.height) {
      s3url +='-'+options.width+'x'+options.height
    }
    s3url += options.ext;
    var r = this.client.putStream(streamIn, s3url, headers, function(err) {
      if (options.width || options.height) {
        fs.unlink(file);
      }
      if (err) { return callback(err) }
      callback(null, r.url)
    })
  }.bind(this))
}
resiZ3.prototype.merge = function(option1,option2){
  var options = {};
  for (var attrname in option1) { options[attrname] = option1[attrname]; }
  for (var attrname in option2) { options[attrname] = option2[attrname]; }
  return options;
}

module.exports = function(file, options, callback) {
  var deferred = Q.defer()
  var r = new resiZ3(config);
  if (typeof options === 'string') {
    options = styles[options]
  }
  else if(options.style) {
    options = r.merge(styles[options.style], options);
  }
  options.ext = path.extname(file);
  options.type = mime.lookup(file);
  options.folder = options.folder ? options.folder+'/' : '/'

  r.resize(file, options,  function(err, filename) {
    if (err) return deferred.reject(err);
    r.upload(filename, options, function(err, url) {
      if (err) return deferred.reject(err);
      deferred.resolve(url);
    });
  })
  return deferred.promise.nodeify(callback)
}
module.exports.rawUpload = function(file, options, callback) {
  var deferred = Q.defer()
  var r = new resiZ3(config);
  options.ext = path.extname(file);
  options.type = mime.lookup(file);
  options.folder = options.folder ? options.folder+'/' : '/'
  r.upload(file, options, function(err, url) {
    if (err) return deferred.reject(err);
    deferred.resolve(url);
  });
  return deferred.promise.nodeify(callback)
}
module.exports.setConfig = function(c) {
  config = c;
}
module.exports.setStyle = function(key, values) {
  styles[key] = values;
}
module.exports.setStyles = function(_styles) {
  if (typeof _styles === 'string') {
    fs.readFile(_styles, 'utf8', function (err, data) {
      if (err) { throw err }
      style = JSON.parse(data);
    });
  }
  else {
    styles = _styles;
  }
}
