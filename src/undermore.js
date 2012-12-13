(function(){
  _.raiseIf = function(condition, text){
    if(condition){
      throw new Error(text);
    }
  };
}());