"use strict";

var _mineflayer = _interopRequireDefault(require("mineflayer"));

var _vec = _interopRequireDefault(require("vec3"));

var _database = require("./database.js");

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

if (process.argv.length < 5 || process.argv.length > 7) {
  console.log('Usage : node echo.js <host> <port> [<name>] [<password>] [<config path>]');
  process.exit(1);
}

var WALK_HEIGHT = 200;
var config = JSON.parse(_fs["default"].readFileSync(process.argv[6], "UTF8"));
console.log("Config loaded: ".concat(JSON.stringify(config)));
var zone = new _database.ChunkZone(config.zone.position, config.zone.size);

_fs["default"].writeFileSync("/tmp/zone.json", zone.dump(), "UTF8");

var bot = _mineflayer["default"].createBot({
  host: process.argv[2],
  port: parseInt(process.argv[3]),
  username: process.argv[4] ? process.argv[4] : 'echo',
  password: process.argv[5],
  version: "1.15.2"
});

bot.on('chat', function (username, message) {
  console.log("".concat(username, ":  ").concat(message));
});
bot.once('spawn', function () {
  bot._client.on('map_chunk', function (data) {
    (0, _database.set_chunk)(data);
  }); // keep your eyes on the target, so creepy!


  bot.creative.startFlying();
  routine();
});

function move_to(_x) {
  return _move_to.apply(this, arguments);
}

function _move_to() {
  _move_to = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(position) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("MOVE FROM ".concat(bot.entity.position, " TO ").concat(position));
            return _context.abrupt("return", new Promise(function (res, rej) {
              bot.creative.flyTo(position, function () {
                if (bot.entity.position.equals(position)) {
                  console.log("MOVE OK");
                  res();
                } else {
                  console.error("MOVE FAILED");
                  rej();
                }
              });
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _move_to.apply(this, arguments);
}

function routine() {
  return _routine.apply(this, arguments);
}

function _routine() {
  _routine = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log("Set Y pos ...");
            _context2.next = 3;
            return move_to((0, _vec["default"])(bot.entity.position, WALK_HEIGHT, bot.entity.position));

          case 3:
            console.log("Set X,Z pos ...");
            _context2.next = 6;
            return move_to((0, _vec["default"])(bot.entity.position, WALK_HEIGHT, bot.entity.position));

          case 6:
            console.log("Placement done !");

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _routine.apply(this, arguments);
}

bot.on('chunkColumnLoad', function (e) {});