var mixEvents = function(target){
	var eventHash = {};
	target.on = function(event , func){
    eventHash[event] = func
	};
	target.trigger = function(event){
    eventHash[event]()
	};
  return target;
};
