(function(){

  var global = this;

  var boundMethodFlag = {};
  var Proxy = function(target){
    _.raiseIf(window.jQuery && target instanceof window.jQuery || target.nodeType === 1, 'bound() cannot yet proxy node-like objects');
    _.raiseIf(target instanceof Proxy, "can't bind a proxy to another proxy");
    if(target.hasOwnProperty('bound')){
      return isBoundMethod(target.bound) ? target.bound('proxy') : _.raise("'bound' key already on object");
    }
    this.target = target;
    var proxy = this;
    _.extend(target, {
      _dependentContextSets: {},
      bound: function(commandName) {
        _.raiseIf(this !== target, "cannot call bound on foreign objects.");
        _.raiseIf(target.bound === undefined, "cannot call bound on objects that lack a bound method.");
        return proxy[commandName].apply(proxy, _.toArray(arguments).slice(1));
      }
    });
    target.bound.prototype = boundMethodFlag;
  };

  Proxy.prototype = {
    constructor: Proxy,

    proxy: function(){
      return this;
    },

    // when no command is passed at all
    'undefined': function(){
      //todo: this probably never deletes context sets stored at keys that are entirely cleared from contexts
      _.invoke(this.target._dependentContextSets, 'invalidateAll');
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
      this._ensuredContextSet(key).invalidateAll();
    },
    del: function(key){
      delete this.target[key];
      this._ensuredContextSet(key).invalidateAll();
    },
    owns: function(key){
      this._addKeyDependency(key);
      return this.hasOwnProperty(key);
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
      return (this.target._dependentContextSets[key] = this.target._dependentContextSets[key] || new bound._ContextSet());
    }

  };

  var isBoundMethod = function(item){
    return item && item.prototype === boundMethodFlag;
  };

  new Proxy(global);
  global.bound.proxy = function(target){
    return new Proxy(target).target;
  };

  bound.isBoundMethod = isBoundMethod;

  global.bound.each = function(collection, block, context){
    var args = _.extend([], arguments);
    args[1] = function(item, key){
      if(key !== bound || !bound.isBoundMethod(item)){
        block.apply(this, arguments);
      }
    };
    _.each.apply(_, args);
  };

}());
