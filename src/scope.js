(function(){
  var parse = function(json){
    var i = 0;

    var consume = function(expected){
      var char = peek();
      _.raiseIf(expected && char !== expected, "Expected " + char + " to be " + expected);
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
        /\w|\_|\$/.test(peek()) ? consumeName() :
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

    var consumeName = function(){
      return resolveName(parseName());
    };

    var parseName = function(){
      var result = '';
      while(/\w|\d|\_|\$/.test(peek()) && peek()){
        result += consume();
      }
      return result;
    };

    var resolveName = function(result){
      return {
        'null': null,
        'true': true,
        'false': false
      }[result];
    }

    var consumeHash = function(){
      var result = {};
      var key;
      consume('{');
      consumeSpace();
      if(peek() === '}'){
        consume('}');
        return result;
      }
      while(peek()){
        key = parseName();
        consumeSpace();
        consume(':');
        consumeSpace();
        result[key] = consumeValue();
        if(peek() === ','){
          consumeSpace();
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

    //TODO white space end of word
    var consumeString = function(){
      var result = '';
      var delimiter = consume();
      _.raiseIf('\'"'.indexOf(delimiter) === -1, 'bad string');
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
    }
  };

}());
