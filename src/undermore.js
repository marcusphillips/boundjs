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

    debug: function (condition) {
      if(condition){ debugger; }
    },

    // TODO: write tests for this function
    isAncestor: function(parent, child){
      var childHadProp = 'ancestryFlag' in parent;
      var parentHadProp = 'ancestryFlag' in parent;
      var parentOldAncestryFlag = parent.ancestryFlag;
      var childOldAncestryFlag = child.ancestryFlag;
      parent.ancestryFlag = ancestryFlag;
      delete child.ancestryFlag;
      var result = child.ancestryFlag === ancestryFlag;
      delete parent.ancestryFlag;
      if (parentHadProp) {
        parent.ancestryFlag = parentOldAncestryFlag;
      }
      if (childHadProp) {
        child.ancestryFlag = childOldAncestryFlag;
      }
      return result;
    }
  });

}());
