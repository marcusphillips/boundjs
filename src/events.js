var mixEvents = function(target){
  var eventHash = {};

  target.on = function(event , func){
    // todo: overwrites old events
    eventHash[event] = func;
  };

  target.trigger = function(event){
    // todo: what context do we want this run in?
    // todo: what arguments should be passed along
    eventHash[event]();
  };

  return target;
};
