(function(){
  bound.topScopeChain = {};
  bound.topScopeChain.extend = function(){};
  bound.topScopeChain.get = function(arg){
  	if( /\d+/.test(arg) ){
  	  return parseInt(arg);
  	}
  	else{
  	  return window[arg]
  	}
  };
}());
