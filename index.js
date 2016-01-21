'use strict';

/**
 * Bind a `thisArg` to all the functions on the target
 *
 * @param  {Object|Array} `target` Object or Array with functions as values that will be bound.
 * @param  {Object} `thisArg` Object to bind to the functions
 * @return {Object|Array} Object or Array with bound functions.
 * @api public
 */

module.exports = function bindEach(target, thisArg) {
  if (!isObject(target)) {
    throw new TypeError('expected an object');
  }

  for (var key in target) {
    var fn = target[key];
    if (typeof fn === 'object') {
      target[key] = bindEach(fn, thisArg);

    } else if (typeof fn === 'function') {
      target[key] = fn.bind(thisArg);

      // copy function keys
      for (var k in fn) {
        target[key][k] = fn[k];
      }
    } else {
      target[key] = fn;
    }
  }
  return target;
};

function isObject(val) {
  return val && typeof val === 'object';
}
