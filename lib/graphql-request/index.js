"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.request = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Helper function for performing
// graphql queries to shopify!
var URL = process.env.SANITY_STUDIO_SHOPIFY_ADMIN_API_URL;
var SHOPIFY_TOKEN = process.env.SANITY_STUDIO_SHOPIFY_TOKEN;

var request = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(query) {
    var variables,
        options,
        res,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            variables = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};

            if (query) {
              _context.next = 3;
              break;
            }

            throw Error("Invalid request. No query provided");

          case 3:
            options = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN
              },
              body: JSON.stringify({
                query: query,
                variables: variables
              })
            };
            _context.prev = 4;
            _context.next = 7;
            return fetch(URL, options);

          case 7:
            res = _context.sent;

            if (!res.ok) {
              _context.next = 12;
              break;
            }

            _context.next = 11;
            return res.json();

          case 11:
            return _context.abrupt("return", _context.sent);

          case 12:
            return _context.abrupt("return", {
              status: res.status,
              message: res.statusText
            });

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](4);
            console.error("There was a problem performing this query:", _context.t0);
            return _context.abrupt("return", {
              error: {
                message: "Unable to perform query. Please check console."
              }
            });

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 15]]);
  }));

  return function request(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.request = request;