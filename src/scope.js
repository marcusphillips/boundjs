(function(){

  bound.scope = {
    _context: window,

    extend: function(obj){
      var newScope = {
        _context: obj,
        _parent: this
      };
      return _.defaults(newScope, bound.scope);
    },

    _findInScope: function(key){
      return key in this._context ? this._context[key] : this._parent && this._parent._findInScope(key);
    },

    lookup: function(json){
      var i = 0;
      var that = this;

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
          /\d|\-/.test(peek()) ? consumeNumber() :
          /\w|\_|\$/.test(peek()) ? consumeName() :
          _.raise('Bad Value')
        );
      };

      //TODO : DIFFERENT KIND OF WITHE SPACE(/n)
      var consumeSpace = function(){
        while(peek() === ' '){
          consume(' ');
        }
      };

      var consumeNumber = function(){
        var result = 0;
        var sign = 1;
        if (peek() === '-' ) {
          consume('-')
          sign = -1;
        }
        while(/\d|\./.test(peek())){
          result += consume();
        }
        return result * sign;
      };

      var keywords = {
        'null': null,
        'true': true,
        'false': false,
        'undefined': undefined
      };

      var consumeName = function(){
        var key = parseName();
        return key in keywords ? keywords[key] : that._findInScope(key);
      };

      var parseName = function(){
        var result = '';
        while(/\w|\d|\_|\$/.test(peek()) && peek()){
          result += consume();
        }
        return result;
      };

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
          if(peek() === '\\'){
            consume();
            result += consume();
          }
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
    }
  };

}());
