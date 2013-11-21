var knox = require('knox'),
    http = require('http'),
    path = require('path'),
    mime = require('mime'),
    gm = require('gm').subClass({ imageMagick: true }),
    fs = require('fs');

var config = {};
var styles = {};


var resizeAndUp = function() {
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
  fs.stat(file, function(err, stats) {
    var headers = {
      'x-amz-acl': 'public-read',
      'Content-Length': stats.size,
      'Content-Type': options.type
    };
    var streamIn = fs.createReadStream(file);
    var s3url = options.folder+Math.round(new Date().getTime())+'-'+options.height+'x'+options.width+options.ext;
    var r = this.client.putStream(streamIn, s3url, headers, function(err) {
      fs.unlink(file);
      if (err) { return callback(err) }
      callback(null, r.url)
    })
  }.bind(this))
}
resizeAndUp.prototype.merge = function(option1,option2){
  var options = {};
  for (var attrname in option1) { options[attrname] = option1[attrname]; }
  for (var attrname in option2) { options[attrname] = option2[attrname]; }
  return options;
}

module.exports = function(file, options, callback) {
  var r = new resizeAndUp(config);
  if (typeof options === 'string') {
    options = styles[options]
  }
  else if(options.style) {
    options = r.merge(styles[options.style], options);
  }
  options.ext = path.extname(file);
  options.type = mime.lookup(file);
  options.folder = options.folder ? options.folder+'/' : '/'
  r.resize(file, options,  function(filename) {
    r.upload(filename, options, callback)
  })
}
module.exports.setConfig = function(c) {
  config = c;
}
module.exports.setStyle = function(key, values) {
  styles[key] = values;
}
module.exports.setStyles = function(styles) {
  if (typeof options === 'string') {
    fs.readFile(options, 'utf8', function (err, data) {
      if (err) { throw err }
      style = JSON.parse(data);
    });
  }
  else {
    styles = styles;
  }
}
