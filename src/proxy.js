/*!
 * bound.proxy - evented JavaScript object observers
 * Version 0.1, part of http://github.com/marcusphillips/bound
 *
 * Copyright 2011, Marcus Phillips
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

/*

--- Dependencies ---
js.js - http://github.com/marcusphillips/bound


--- Example usage ---

// we have some object in our system that we would loke to have proxy access to
var myObject = {foo: 0};

// first, we get a proxy using the global bound() function
var myProxy = bound(myObect);

// we can use the proxy to set values on the object in an evented way, that listeners can subscribe to anywhere else in the code
myProxy.set('foo', 1);

// every proxy stores its target object at .target, where you can manipulate it directly, (though you give up automatic event notification this way)
myProxy.target.foo = 2;

// once an object has been proxied for the first time, it gets a helper method that can send commands directly to its proxy
myObject.bound('set', 'foo', 3);

// you can easily mix access between the two with chaining, as follows
myObject.bound('del', 'foo').bound({bar:'baz'}).bound('prop', 'foo');

*/

/*
(function(){
  var Proxy = function(object){
    throwErrorIf(object instanceof Proxy, 'cannot proxy a proxy');

    // proxies are cached on the object, so if the object has one already, return it
    if(object.hasOwnProperty('bound')){
      return object.bound && object.bound.prototype._boundFlag ? object.bound('proxy') : throwError('object already has a different .bound property!');
    }

    //asdf move this up
    // add a .bound() method to the object for alternate access to the commands.
    // calling an object's .bound() method executes the cammand supplied at argument 1, passing along all subsequent args to the command itself
    // when the first argument is an object, the command is assumed to be a 'set'
    // when called with no args at all, the command is assumed to be publish ('pub')
    object.bound = function(command){
      if(this !== object){
        throwErrorIf(this === global, 'cannot call global.bound()'); //.bound() cannot be called in the context of the global object
        return bound(this).object.bound.apply(this, arguments);
      }
      throwErrorIf(arguments.length && !proxy[command], 'invalid command to .bound()');

      var result = (
        typeof command === 'object' ? proxy.set.apply(proxy, arguments) :
        proxy[command || 'pub'].apply(proxy, slice(arguments, 1))
      );
      // to facilitate chaining, always return the object object unless a special return value was provided by the method
      return command === 'proxy' || result !== proxy ? result : object;
    };
    // hide a flag on the prototype object, since it is unenumerable and is unlikely to be copied accidentally
    object.bound.prototype._boundFlag = true;

    var proxy = extend(this, {
      key: unique(object.nodeType === 1 ? 'boundNode' : 'boundObject'),
      object: object,
      observers: {},
      observersByProperty: {}
    });

    for(var i=0; i<bound.extensions.length; i++){
      bound.extensions[i].init.apply(this, arguments);
    }

  };

  // to facilitate chaining, instance methods generally return the target object (unless the nature of the method entails a different return, such as .get())
  extend(Proxy.prototype, {
    // publish the supplied event, or all pending ones? (could be a conceptual collision between the notions of .commit() and .publish() - might not be able to overlap them)
    proxy: function(){ return this; },
    meta: function(key, val){ return prop.apply(this, [this].concat(slice(arguments))); }
  });

  each('prop accessor get getter set setter run runner exec executer del deleter has owns'.split(' '), function(methodName){
    Proxy.prototype[methodName] = function(){
      return js[methodName].apply(this, [this.object].concat(slice(arguments)));
    }
  });

}());
*/
