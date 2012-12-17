(function(){
  bound.topScopeChain = {};
  bound.topScopeChain.extend = function(){};
  bound.topScopeChain.get = function(arg){
  	if( /\d+/.test(arg) ){
  	  return parseInt(arg);
  	}else {
      if(window[arg]){
        return window[arg];
      }else if(/'[^']*'|"[^"]*"/.test(arg)){
        return arg.slice(1, arg.length - 1);
      }
  	}
  };
}());

//