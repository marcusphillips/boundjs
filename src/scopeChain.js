(function(){
  bound.topScopeChain = {};
  bound.topScopeChain.extend = function(){};
  bound.topScopeChain.get = function(arg){
    return (window[arg]) ? window[arg] : parse(arg);
  };  
}());

    var parse = function(json){
      var i = 0;

      var next = function(){
        var char = json[i];
        i++;
        return char;
      };

      var peek = function(){
        return json[i];
      };

      var consumeValue = function(){
        var result;
        if(parsers[peek()]){
          result = parsers[peek()]();
        }else if(/\d/.test(peek())){
          result = consumeNumber();
        }else if(/\w/.test(peek())){
          result = consumeToken();
        }
        return result;
      };

      var consumeWhiteSpace = function(){
        while(peek() === ' '){
          next();
        }
      };

      //TODO deal with -(neg)
      //TODO decimal point
      var consumeNumber = function(){
        var result = 0;
        while(/\d/.test(peek())){
          result = result + next();
        }
        return +result;
      };

      var consumeToken = function(){

      }

      var consumeHash = function(){
        var result = {};
        //
        return result;
      };

      var consumeDoubleQ = function(){
        next();
        var result = '';
        while(peek() !== '"'){
          result += next();
        }
        return result;
      };

      var consumeSingleQ = function(){
        next();
        var result = '';
        while(peek() !== "'"){
          result += next();
        }
        return result;
      };

      var consumeArray = function(){
        var result = [];
        while(next() !== ']'){
          result.push(peek());
          if(next() === ','){
            next();
          }
        };
        return result;
      };

      var parsers = {
        '[': consumeArray,
        '{': consumeHash,
        '"': consumeDoubleQ,
        "'": consumeSingleQ,
        ' ': consumeWhiteSpace
      };

      return consumeValue();
    };
