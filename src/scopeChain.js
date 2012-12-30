(function(){
  bound.topScopeChain = {};
  bound.topScopeChain.extend = function(){};
  bound.topScopeChain.get = function(arg){
    return (window[arg]) ? window[arg] : parse(arg);
  };  
}());

    var parse = function(json){
      var i = 0;

      var consume = function(expVal){
        var char = peek();
        if(char !== expVal){
          throw new Error("Expected " + char + " to be " + expVal)
        }
        i++;
        return char;
      };

      var peek = function(){
        return json[i];
      };

      var consumeValue = function(){
        var result;
        var char = peek()
        if(parsers[char]){
          return parsers[char]();
        }else if(/\d/.test(char)){
          return consumeNumber();
        }else if(/\w/.test(char)){
          return consumeToken();
        }
        return result;
      };

      var consumeSpace = function(){
        while(peek() === ' '){
          consume(' ');
        }
      };

      //TODO deal with -(neg)
      //TODO decimal point
      var consumeNumber = function(){
        var result = 0;
        while(/\d/.test(peek())){
          result = result + peek();
          i++
        }
        return +result;
      };

      var consumeToken = function(){
        switch (peek()) {
          case "t":
            consume("t");
            consume("r");
            consume("u");
            consume("e");
            return true;
          case "f":
            consume("f");
            consume("a");
            consume("l");
            consume("s");
            consume("e");
            return false;
          case "n":
            consume("n");
            consume("u");
            consume("l");
            consume("l");
            return null;
          default:
          return undefined;
        }
      }

      var consumeHash = function(){
        var result = {};
        var key;
        var val;
        consume("{");
        consumeSpace();
        //code for key
        consume(':');
        consumeSpace();
        //code for value
        consume(',')
        consumeSpace();
        //code for recursion
        result[key] = val
        return result;
      };

      var consumeDoubleQ = function(){
        var result = '';
        consume('"');
        consumeSpace();
        while(peek()){
          result += peek();
          i++;
          if(peek() === '"'){
            consume('"');
            return result;
          }
        }
        throw new Error("Bad string");
      };

      var consumeSingleQ = function(){
        var result = '';
        consume("'");
        consumeSpace();
        while(peek()){
          result += peek();
          i++;
          if(peek() === "'"){
            consume("'");
            return result;
          }
        }
        throw new Error("Bad string");
      };


      //TODO nested array 
      var consumeArray = function(){
        var result = [];
        consume('[');
        consumeSpace();
        if(peek() === ']'){
          consume(']');
          return result;
        }
        while(peek()){
          result.push(consumeValue());
          if(peek() === ']'){
            return result;
          }
          consume(',');
          consumeSpace();
        }
        throw new Error("Bad array");
      };

      var parsers = {
        '[': consumeArray,
        '{': consumeHash,
        '"': consumeDoubleQ,
        "'": consumeSingleQ,
        ' ': consumeSpace
      };

      return consumeValue();
    };
