(function(){
  var parse = function(json){
    var i = 0;

    var consume = function(expVal){
      var char = peek();
      _.raiseIf(expVal && char !== expVal, "Expected " + char + " to be " + expVal);
      i++;
      return char;
    };

    var peek = function(){
      return json[i];
    };

    var consumeValue = function(){
      consumeSpace();
      return (
        parsers[peek()] ? parsers[peek()]() :
        /\d/.test(peek()) ? consumeNumber() :
        /\w/.test(peek()) ? consumeToken() :
        _.raise('Bad Value')
      );
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
        result = result + consume();
      }
      return +result;
    };

    var consumeToken = function(){
      if(peek() === '{'){
        var result = '';
        consume('{');
        consumeSpace();
        while(peek()){
          result += consume();
          if(peek() === ':'){
            consume(':');
            return result;
          }
        }
      }else{
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
    }

    var consumeHash = function(){
      var result = {};
      var key;
      while(peek()){
        key = consumeToken();
        consumeSpace();
        result[key] = consumeValue();
        if(peek() === ','){
          consume(',');
          consumeSpace();
        }
        if(peek() === '}'){
          consume('}');
          break;
        }
      }
      return result;
    };

    var consumeKey = function(){
    };

    //TODO white space end of word
    var consumeString = function(){
      var result = '';
      var delimiter = consume();
      _.raiseIf('\'"'.indexOf(delimiter) === -1, 'bad string');
      consumeSpace();
      while(peek()){
        result += consume();
        if(peek() === delimiter){
          consume();
          return result;
        }
      }
      throw new Error("Bad string");
    };

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
          consume(']');
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
      '"': consumeString,
      "'": consumeString,
      ' ': consumeSpace
    };

    return consumeValue();
  };

  bound.scope = {
    _context: window,
    _parent: {
      lookup: parse
    },

    extend: function(obj){
      var newScope = {
        _context: obj,
        _parent: this
      };
      return _.defaults(newScope, bound.scope);
    },

    lookup: function(key){
      // todo: write a test to see what happens when we lookup a property with a falsey value
      return this._context[key] ? this._context[key] : this._parent.lookup(key);
      //return this._context[arg] ? this._context[arg] : parse(arg);
    }
  };

}());
