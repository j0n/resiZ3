# Resize and upload to S3

## Setup

```javascript
var res3ize = require('./resize-and-s3-upload/index');
 // fix your keys to S3
var config = {
  s3 :  {
    key: 'key'
    , secret: 'secret'
    , bucket: 'bucket'
    , endpoint: 's3.amazonaws.com'
  }
}
res3ize.setConfig(config); // set your keys to s3
```


# resize and upload

```javascript
res3ize('./image.png',{width: 100, height: 100}, function(err, url) {
  console.log('file uploaded to amazon', url);
});
```

## Set style to reuse
```
res3ize.setStyle('middle', {folder: 'food' ,width: 20, height: 20});
```

## use style
```
res3ize('./image.png','middle', function(err, url) {
  console.log('file uploaded to amazon', url);
});
```
use style but change folder
```
res3ize('./image.png',{style: 'middle', folder: 'tmp'}, function(err, url) {
  console.log('file uploaded to amazon', url);
});
```