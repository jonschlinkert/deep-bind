'use strict';

var merge = require('mixin-deep');

/**
 * Bind a `thisArg` to all the functions on the target
 *
 * @param  {Object|Array} `target` Object or Array with functions as values that will be bound.
 * @param  {Object} `thisArg` Object to bind to the functions
 * @return {Object|Array} Object or Array with bound functions.
 * @api public
 */

function deepBind(target, thisArg, options) {
  if (!isObject(target)) {
    throw new TypeError('expected an object');
  }

  options = options || {};

  for (var key in target) {
    var fn = target[key];
    if (typeof fn === 'object') {
      target[key] = deepBind(fn, thisArg);

    } else if (typeof fn === 'function') {
      target[key] = bind(thisArg, key, fn, options);

      // copy function keys
      for (var k in fn) {
        target[key][k] = fn[k];
      }
    } else {
      target[key] = fn;
    }
  }
  return target;
}

function isObject(val) {
  return val && typeof val === 'object';
}

function bind(thisArg, key, fn, options) {
  return function() {
    var newThisArg = thisArg;  
    if (!newThisArg.hasOwnProperty('options')) {
      newThisArg.options = {};
    }

    if (typeof options.bindFn === 'function') {
      newThisArg = options.bindFn(newThisArg, key, this, options);
    }

    if (options.hasOwnProperty(key)) {
      var val = options[key];
      newThisArg.options[key] = val;
      if (isObject(val)) {
        newThisArg.options = merge({}, newThisArg.options, val);
      }
    }
    return fn.apply(newThisArg, arguments);
  }
}

/**
 * Expose `deepBind`
 */

module.exports = deepBind;
