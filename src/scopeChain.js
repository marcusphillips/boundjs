(function(){
  bound.topScopeChain = {};
  bound.topScopeChain.extend = function(){};
  bound.topScopeChain.get = function(arg){
  	if (window[arg]){
  	  return window[arg];
  	}else{
  	  return Number(arg) ? Number(arg) : undefined;
  	}
  };
}());
