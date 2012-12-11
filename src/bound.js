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

  global.bound = bound;
}());
