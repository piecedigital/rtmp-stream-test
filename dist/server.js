"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _stream = require("./stream");

var _stream2 = _interopRequireDefault(_stream);

var PORT = process.env.PORT || 9090;

var app = (0, _express2["default"])();

app.use(_express2["default"]["static"](_path2["default"].join(__dirname, "public")));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  next();
});

app.get("/get-stream", function (req, res) {
  (0, _stream2["default"])(res);
  // res.on("data", function (chunk) {
  //   console.log(chunk);
  // })
});

// app.get("/stream.m3u8", (req, res) => {
//   // stream(res);
//   res.on("data", function (chunk) {
//     console.log(chunk);
//   })
// });

app.listen(PORT, function () {
  console.log("listening on port:", PORT);
});