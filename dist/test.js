"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var rs = _fs2["default"].createReadStream(_path2["default"].join(__dirname, "public", "output.flv"));
rs.on("data", function (chunk) {
  console.log(chunk);
});