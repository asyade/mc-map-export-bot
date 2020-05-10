"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chunk_fname = chunk_fname;
exports.set_chunk = set_chunk;
exports.SESSION_DIR = exports.ChunkZone = void 0;

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SESSION_DIR = "".concat(process.env.HOME, "/.mcdump");
exports.SESSION_DIR = SESSION_DIR;

try {
  _fs["default"].mkdirSync(SESSION_DIR);
} catch (e) {}

function chunk_fname(x, z) {
  return "".concat(SESSION_DIR, "/").concat(x, "_").concat(z, ".json");
}

function set_chunk(data) {
  _fs["default"].writeFile(chunk_fname(data.x, data.z), JSON.stringify(data), "utf8", function () {});
}

var ChunkZone = /*#__PURE__*/function () {
  function ChunkZone(position, size) {
    _classCallCheck(this, ChunkZone);

    this.position = position;
    this.size = size;
    this.line = [];

    for (var x = 0; x < size[0]; x++) {
      var column = [];

      for (var z = 0; z < size[1]; z++) {
        var fname = chunk_fname(position[0] + x, position[1] + z);
        column.push(_fs["default"].existsSync(fname));
      }

      this.line.push(column);
    }
  }

  _createClass(ChunkZone, [{
    key: "dump",
    value: function dump() {
      var str = "";

      for (var z = this.position[1]; z < this.position[1] + this.size[1]; z++) {
        for (var x = this.position[0]; x < this.position[0] + this.size[0]; x++) {
          var exist = _fs["default"].existsSync(chunk_fname(x, z));

          str += exist ? '#' : '.';
        }

        str += '\n';
      }

      return str;
    }
  }]);

  return ChunkZone;
}();

exports.ChunkZone = ChunkZone;