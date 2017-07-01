// $ ffmpeg -y -loglevel warning -f dshow -i video="screen-capture-recorder" -vf crop=690:388:136:0 -r 30 -s 962x388 -threads 2 -vcodec libx264 -vpre baseline -vpre my_ffpreset -f flv rtmp:///live/myStream.sdp
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

// import ffmpeg from "fluent-ffmpeg";

var _rtmpdump = require("rtmpdump");

var _rtmpdump2 = _interopRequireDefault(_rtmpdump);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

exports["default"] = function (res) {
  // var outStream = fs.createWriteStream(path.join(__dirname, 'output.mp4'));
  var outStream = res;

  // console.log("made options");
  var options = {
    rtmp: 'rtmp://192.168.118.128/live/test',
    // playpath: 'mp4:playpath',
    // pageUrl: 'http://host.tld/somepage.html',
    // swfVfy: 'http://host.tld/player.swf',
    v: null // parameter-less command line switches must have null as a value
  };
  // console.log("made stream");
  var stream = _rtmpdump2["default"].createStream(options);
  // console.log("connect event");
  stream.on('connected', function (info) {
    // info provides various details about the stream
    // duration, resolution, codecs, ...
    console.log(info);
  });
  // console.log("progress event");
  stream.on('progress', function (kbytes, elapsed, percent) {
    console.log('%s kbytes read, %s secs elapsed, %s%%', kbytes, elapsed, percent);
  });
  stream.on('data', function (chunk) {
    // console.log("data", chunk);
  });
  stream.on('readable', function () {
    console.log("we can read this now");
    // console.log("readable:", stream.read());
  });
  // console.log("error event");
  stream.on('error', function (err) {
    // as usual, unhandled error events will throw
    console.log(err);
    stream.exit(1);
  });
  // console.log("pipe ;D");
  stream.pipe(outStream);
};

module.exports = exports["default"];