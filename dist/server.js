"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

// import stream from "./stream";

var PORT = process.env.PORT || 9090;

var app = (0, _express2["default"])();

app.use(_express2["default"]["static"](_path2["default"].join(__dirname, "public")));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  next();
});

app.get("/streams/:file", function (req, res) {
  console.log("sending stream file:", req.params.file);
  var thisPath = _path2["default"].join(__dirname, "public/streams/stream.m3u8");
  _fs2["default"].access(thisPath, _fs2["default"].constants.F_OK && _fs2["default"].constants.R_OK, function (err) {
    if (err) {
      console.log("access err", err.stack || err);
      res.status(404).send("No file");
    } else {
      res.sendFile(thisPath);
    }
  });
});

var filePath = "public/streams/stream.m3u8";

var filePathArray = filePath.split("/");
filePathArray.pop();
new Promise(function (resolve, reject) {
  filePathArray.map(function (folder, ind) {
    console.log("folder:", folder);
    var thisPath = _path2["default"].join.apply(null, [__dirname].concat(filePathArray.slice(0, ind + 1)));
    console.log("this path:", thisPath);
    _fs2["default"].access(thisPath, _fs2["default"].constants.F_OK && _fs2["default"].constants.R_OK && _fs2["default"].constants.W_OK, function (err) {
      console.log(ind, ind + 1, filePathArray.length);
      if (err) {
        _fs2["default"].mkdirSync(thisPath);
        console.log("access err", err.stack || err);
      }
      if (ind + 1 === filePathArray.length) resolve();
    });
  });
}).then(function () {
  console.log("we're all good to start streaming");
  console.log(filePath);
  var stream = _child_process2["default"].exec("ffmpeg -v verbose -i rtmp://192.168.118.128/live/test -c:v libx264 -c:a aac -ac 1 -strict -2 -crf 18 -profile:v baseline -maxrate 400k -bufsize 1835k -pix_fmt yuv420p -flags -global_header -hls_time 10 -hls_list_size 6 -hls_wrap 10 -start_number 1 \"" + _path2["default"].join(__dirname, filePath) + "\"", function (err, stdout, stderr) {
    if (err) {
      return console.error("main err:", err.stack || err);
    }

    stdout ? console.log(stdout) : null;
    stderr ? console.error("stderr:", stderr.stack || stderr) : null;
  });

  // stream.on("error", e => console.error("process err:", e));
  stream.on("exit", function (e) {
    return console.log("Exit");
  });
  stream.on("disconnect", function (e) {
    return console.log("Disconnect");
  });
})["catch"](function (e) {
  return console.error("catch err:", e.stack || e);
});

app.listen(PORT, function () {
  console.log("listening on port:", PORT);
});