(function(){
  _.throwErrorIf = function(condition, text){
    if(condition){
      throw new Error(text);
    }
  };
}());