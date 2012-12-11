(function(){
  var global = this;

  var bound = function(target){
    _.throwErrorIf(window.jQuery && target instanceof window.jQuery || target.nodeType === 1, 'bound() cannot yet proxy node-like objects');
    if(typeof target === 'string'){
      return libraryCommands[target].apply({}, _.toArray(arguments).slice(1));
    }
    _.defaults(target, {
      ctrl: ctrlMethod,
      _dependentContextSets: {}
    });
    return target;
//    return new Proxy(target);
  };

  var libraryCommands = {
    global: function(commandName){
      return commands[commandName].apply(global, _.toArray(arguments).slice(1));
    }
  };

  var ctrlMethod = function(commandName) {
    var args = _.toArray(arguments).slice(1);
    //todo: this probably never evicts invalidated contexts
    if (arguments.length) {
      return commands[commandName].apply(this, args);
    } else {
      _.invoke(getDependentContextSets(this), 'invalidateAll');
    }
  };

  var commands = {
    has: function(key){
      addKeyDependency(this, key);
      return key in this;
    },
    get: function(key){
      addKeyDependency(this, key);
      return this[key];
    },
    set: function(key, value){
      // todo: keep track of the current state to compare to future states
      this[key] = value;
      ensuredContextSet(this, key).invalidateAll();
    },
    del: function(key){
      // todo: keep track of the current state to compare to future states
      delete this[key];
      ensuredContextSet(this, key).invalidateAll();
    }
  };

  var getDependentContextSets = function(object){
    return object === global ? globalDependentContextSets : object._dependentContextSets;
  };

  var addKeyDependency = function(object, key){
    ensuredContextSet(object, key).addCurrentContext();
  };

  var ensuredContextSet = function(object, key){
    var dependentContextSets = object === global ? globalDependentContextSets : object._dependentContextSets;
    return (dependentContextSets[key] = dependentContextSets[key] || new bound._ContextSet());
  };
  var globalDependentContextSets = {};

  global.bound = bound;
}());
