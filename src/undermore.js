(function(){
  var ancestryFlag = {};

  _.extend(_, {
    raise: function(text){
      throw new Error(text);
    },
    raiseIf: function(condition, text){
      condition && _.raise(text);
    },
    create: function (o) {
      _.raiseIf(arguments.length > 1, 'Object.create implementation only accepts the first parameter.');
      function F() {}
      F.prototype = o;
      return new F();
    },
    // TODO: write tests for this function
    isAncestor: function(parent, child){
      var hadProp = 'ancestryFlag' in parent;
      var oldAncestryFlag = parent.ancestryFlag;
      parent.ancestryFlag = ancestryFlag;
      var result = child.ancestryFlag === ancestryFlag;
      delete parent.ancestryFlag;
      if (hadProp) {
        parent.ancestryFlag = oldAncestryFlag;
      }
      return result;
    }
  });

}());
