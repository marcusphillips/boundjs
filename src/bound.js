(function(){

  var global = this;

  var boundMethodFlag = {};
  var Proxy = function(target){
    if(target.hasOwnProperty('bound')){
      // TODO: bound property of null
      return target.bound.prototype === boundMethodFlag ? target.bound('proxy') : _.raise("'bound' key already on object");
    }
    this.target = target;
    var proxy = this;
    _.extend(target, {
      _dependentContextSets: {},
      bound: function(commandName) {
        if(this !== target){
          throw new Error("cannot call bound on foreign objects.");
        }
        return commandName === 'proxy' ? proxy : proxy[commandName].apply(this, _.toArray(arguments).slice(1));
      }
    });
    target.bound.prototype = boundMethodFlag;
  };

  Proxy.prototype = {
    constructor: Proxy,

    // when no command is passed at all
    'undefined': function(){
      //todo: this probably never deletes context sets stored at keys that are entirely cleared from contexts
      _.invoke(this._dependentContextSets, 'invalidateAll');
      return this;
    },

    has: function(key){
      addKeyDependency(this, key);
      return key in this;
    },
    get: function(key){
      addKeyDependency(this, key);
      return this[key];
    },
    set: function(key, value){
      // todo: keep track of the current state to compare to future states, here and in del
      this[key] = value;
      ensuredContextSet(this, key).invalidateAll();
    },
    del: function(key){
      delete this[key];
      ensuredContextSet(this, key).invalidateAll();
    },
    owns: function(key){
      //calls hasOwnProperty
      if(key === undefined || key === null){
        return false;
      }
      _.raiseIf(typeof key !== 'string', 'string required');
      return this.hasOwnProperty(key);
    },
    run: function(){
      if(key === undefined || key === null){
        return false;
      }
      _.raiseIf(typeof key !== 'string', 'string required');

    },
    exec: function(){
      if(key === undefined || key === null){
        return false;
      }
      _.raiseIf(typeof key !== 'string', 'string required');

    },
    pub: function(){
      if(key === undefined || key === null){
        return false;
      }
      _.raiseIf(typeof key !== 'string', 'string required');

    },
    sub: function(){
      if(key === undefined || key === null){
        return false;
      }
      _.raiseIf(typeof key !== 'string', 'string required');

    },
    proxy: function(){
      if(key === undefined || key === null){
        return false;
      }
      _.raiseIf(typeof key !== 'string', 'string required');

    },
    meta: function(){
      if(key === undefined || key === null){
        return false;
      }
      _.raiseIf(typeof key !== 'string', 'string required');

    }
  };

  var addKeyDependency = function(object, key){
    ensuredContextSet(object, key).addCurrentContext();
  };

  var ensuredContextSet = function(object, key){
    return (object._dependentContextSets[key] = object._dependentContextSets[key] || new bound._ContextSet());
  };

  new Proxy(global).target.bound.proxy = function(target){
    _.raiseIf(window.jQuery && target instanceof window.jQuery || target.nodeType === 1, 'bound() cannot yet proxy node-like objects');
    return new Proxy(target).target;
  };

}());
