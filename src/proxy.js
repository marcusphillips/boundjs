(function(global){
  "use strict";

  // TODO: test that passing in non-objects throws an informative error

  var boundify = function(target){
    _.raiseIf(window.jQuery && target instanceof window.jQuery || target.nodeType === 1, 'bound() cannot yet proxy node-like objects');
    _.raiseIf(isProxy(target), "can't bind a proxy to another proxy");
    if(target.hasOwnProperty('bound')){
      return B.isProxy(target.bound) ? target : _.raise("'bound' key already on object");
    }

    var proxy = target.bound = function(){
      _.raiseIf(target.bound !== proxy, "cannot call bound on objects that lack a bound method.");
      if (this !== target) {
        _.raiseIf(!_.isAncestor(target, this), "cannot call bound on foreign objects.");
        return B(this).apply(this, arguments);
      }
      //todo: this probably never deletes context sets stored at keys that are entirely cleared from contexts
      if(arguments.length){
        return proxy[arguments[0]].apply(proxy, _.toArray(arguments).slice(1));
      }else{
        _.invoke(proxy._dependentContextSets, 'invalidateAll');
        return this;
      }
    };
    _.extend(proxy, proxyMethods, {
      target: target,
      _dependentContextSets: {},
      prototype: boundMethodFlag
    });

    return target;
  };

  var boundMethodFlag = {};
  var proxyMethods = {

    getProxy: function(){
      return this;
    },

    has: function(key){
      this._addKeyDependency(key);
      return key in this.target;
    },
    get: function(key){
      this._addKeyDependency(key);
      return this.target[key];
    },
    set: function(key, value){
      // todo: keep track of the current state to compare to future states, here and in del
      this.target[key] = value;
      // todo: only invalidate the keys that were set -- do this for other mutator methods as well. first though, write tests to ensure that we keep track of how many keys get visited in the process
      this._ensuredContextSet(key).invalidateAll();
    },
    del: function(key){
      delete this.target[key];
      this._ensuredContextSet(key).invalidateAll();
    },
    owns: function(key){
      this._addKeyDependency(key);
      return this.target.hasOwnProperty(key);
    },
    run: function(){
    },
    exec: function(){
    },
    pub: function(){
    },
    sub: function(){
    },
    meta: function(){
    },

    _addKeyDependency: function(key){
      this._ensuredContextSet(key).addCurrentContext();
    },

    _ensuredContextSet: function(key){
      return (this._dependentContextSets[key] = this._dependentContextSets[key] || new B.depend._ContextSet());
    }

  };

  var isProxy = function(item){
    return item && item.prototype === boundMethodFlag;
  };

  boundify(global);

  global.bound.proxy = function(target){
    return boundify(target);
  };

  global.B = function(target){
    return boundify(target).bound;
  };

  global.B.isProxy = isProxy;

  global.B.each = function(collection, block, context){
    var args = _.extend([], arguments);
    args[1] = function(item, key){
      //todo: write tests for B.each
      if(key !== 'bound' || !B.isProxy(item)){
        block.apply(this, arguments);
      }
    };
    _.each.apply(_, args);
  };


  //TODO : add method only to proxies of the relevent types.
  var underscoreProp = [
    // Collections
    "each",
    "map",
    "reduce",
    "reduceRight",
    "find",
    "filter",
    "where",
    "reject",
    "every",
    "some",
    "contains",
    "invoke",
    "pluck",
    "max",
    "min",
    "sortBy",
    "groupBy",
    "countBy",
    "shuffle",
    "toArray",
    "size",

    // Arrays
    "first",
    "initial",
    "last",
    "rest",
    "compact",
    "flatten",
    "without",
    "union",
    "intersection",
    "difference",
    "uniq",
    "zip",
    "object",
    "indexOf",
    "lastIndexOf",
    "sortedIndex",
    "range",

    // Functions
    "bind",
    "bindAll",
    "memoize",
    "delay",
    "defer",
    "throttle",
    "debounce",
    "once",
    "after",
    "wrap",
    "compose",

    // Objects
    "keys",
    "values",
    "pairs",
    "invert",
    "functions",
    "extend",
    "pick",
    "omit",
    "defaults",
    "clone",
    "tap",
    "has",
    "isEqual",
    "isEmpty",
    "isElement",
    "isArray",
    "isObject",
    "isArguments",
    "isFunction",
    "isString",
    "isNumber",
    "isFinite",
    "isBoolean",
    "isDate",
    "isRegExp",
    "isNaN",
    "isNull",
    "isUndefined"
  ];

  _.each(underscoreProp, function(methodName){
    proxyMethods[methodName] = function(){
      var args = [this.target].concat(_.toArray(arguments));
      return _[methodName].apply(_, args);
    };
  });

}(this));
