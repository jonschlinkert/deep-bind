'use strict';

require('mocha');
var assert = require('assert');
var deepBind = require('./');

describe('deepBind', function() {
  it('should bind a context to fns passed on an object:', function() {
    var ctx = {
      app: {views: {}},
      context: {a: 'b'}
    };

    var helpers = deepBind({
      foo: function() {
        return this.context;
      },
      bar: function() {},
      baz: function() {}
    }, ctx);

    assert.deepEqual(helpers.foo(), {a: 'b'});
  });

  it('should bind a context to deeply nested functions', function() {
    var ctx = {
      app: {
        views: {}
      },
      context: {
        a: 'b'
      }
    };
    var helpers = deepBind({
      abc: {
        foo: function() {
          return this.context;
        },
        bar: function() {},
        baz: function() {},
        qux: {
          fez: function() {
            return this.context;
          }
        }
      }
    }, ctx);

    assert.deepEqual(helpers.abc.qux.fez(), {a: 'b'});
  });

  it('should bind a context to fns passed on an object of objects:', function() {
    var ctx = {
      app: {
        views: {}
      },
      context: {
        a: 'b'
      }
    };
    var obj = {
      abc: {
        foo: function() {
          return this.context;
        },
        bar: function() {},
        baz: function() {}
      }
    };
    obj.abc.foo.async = true;
    var helpers = deepBind(obj, ctx);
    assert(helpers.abc.foo.async === true);
  });

  it('should throw an error when invalid args are passed', function(cb) {
    try {
      deepBind();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected an object');
      cb();
    }
  });
});
