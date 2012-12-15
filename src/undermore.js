(function(){
  _.raiseIf = function(condition, text){
    if(condition){
      throw new Error(text);
    }
  };
  _.create = function (o) {
    _.raiseIf(arguments.length > 1, 'Object.create implementation only accepts the first parameter.');
    function F() {}
    F.prototype = o;
    return new F();
  }
}());