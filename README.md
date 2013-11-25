# resiZ3
resize your image and upload to S3

## Setup

```javascript
var resiZ3 = require('./resize-and-s3-upload/index');
 // fix your keys to S3
var config = {
  s3 :  {
    key: 'key'
    , secret: 'secret'
    , bucket: 'bucket'
    , endpoint: 's3.amazonaws.com'
  }
}
resiZ3.setConfig(config); // set your keys to s3
```


## resize and upload

```javascript
resiZ3('./image.png',{width: 100, height: 100}, function(err, url) {
  console.log('file uploaded to amazon', url);
});
```

## Set style to reuse
```
resiZ3.setStyle('middle', {folder: 'food' ,width: 20, height: 20});
```

## use style
```
resiZ3('./image.png','middle', function(err, url) {
  console.log('file uploaded to amazon', url);
});
```
use style but change folder
```
resiZ3('./image.png',{style: 'middle', folder: 'tmp'}, function(err, url) {
  console.log('file uploaded to amazon', url);
});
```
## upload without resize
```javascript
resiZ3.rawUpload('./image.png',{folder: 'tmp'}, function(err, url) {
  console.log('file uploaded to amazon', url);
});
```
