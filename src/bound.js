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
        return commandName === 'proxy' ? proxy : commands[commandName].apply(this, _.toArray(arguments).slice(1));
      }
    });
    target.bound.prototype = boundMethodFlag;
  };

  var commands = {

    // when no command is passed at all
    'undefined': function(){
      //todo: this probably never evicts invalidated contexts
      _.invoke(this._dependentContextSets, 'invalidateAll');
      return this;
    },

    has: function(key){
      if(key === undefined || key === null){
        return false;
      }
      _.raiseIf(typeof key !== 'string', 'string required');
      addKeyDependency(this, key);
      return key in this;
    },
    get: function(key){
      if(key === undefined || key === null){
        return false;
      }
      _.raiseIf(typeof key !== 'string', 'string required');
      addKeyDependency(this, key);
      return this[key];
    },
    set: function(key, value){
      if(key === undefined || key === null){
        return false;
      }
      _.raiseIf(typeof key !== 'string', 'string required');
      // todo: keep track of the current state to compare to future states, here and in del
      this[key] = value;
      ensuredContextSet(this, key).invalidateAll();
    },
    del: function(key){
      if(key === undefined || key === null){
        return false;
      }
      _.raiseIf(typeof key !== 'string', 'string required');
      delete this[key];
      ensuredContextSet(this, key).invalidateAll();
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
