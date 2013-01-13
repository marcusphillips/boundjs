describe('scopes', function(){

  var parentScope, childScope;

  beforeEach(function(){
    parentScope = bound.scope.extend(message);
    childScope = parentScope.extend(alice);
  });

  describe('basics', function(){

    it('introduces a top level scope', function(){
      expect(bound.scope).toEqual(any(Object));
    });

    it('can create subscopes', function(){
      expect(bound.scope.extend).toEqual(any(Function));
    });

  });

  describe('lookups', function(){

    it('allows lookups in the global scope from the top level scope', function(){
      global.present = 3;
      expect(bound.scope.lookup('present')).toEqual(3);
      expect(bound.scope.lookup('absent')).toEqual(undefined);
      delete global.present;
    });

    it('lookups in a child scope fall through to the parent scope', function(){
      expect(childScope.lookup('text')).toEqual('hi');
    });

  });

  describe('literals', function(){

    it('should allow lookups of literal objects, arrays, and strings with double and single quotes', function(){
      _.each({
        '3': 3,
        '32223': 32223,
        '0032223': 32223,
        '010023': 10023,
        '"in doubles"': 'in doubles',
        "'in singles'": 'in singles',
        "[]": [],
        '[  ]': [],
        '["a", 3, false]': ['a', 3, false],
        '[[1], [2], [3]]': [[1], [2], [3]],
        '{}': {},
        '{key: [1,2,3,4]}': {key: [1,2,3,4]},
        '{key: {key4: "value"}}': {key: {key4: 'value'}},
        'false': false,
        'true': true,
        'null': null,
        'undefined': undefined,
        'absent': undefined,
        '"   whitespace"': 'whitespace',
        '"trues"': 'trues',
        ' " this string starts with 3 spaces" ': ' this string starts with 3 spaces',
        //' "this string has the escaped delimiter symbol \" in it" ': 'this string has the escaped delimiter symbol " in it', 
        //'truealy': undefined
        //'-1' : -1,
        //'0.14': 0.14
        //'{key: text}': {key: 'hi'},
        //'bob.name': 'bob'
      }, function(value, key){
        var controller = bound.scope.extend(message);
        expect(controller.lookup(key)).toEqual(value);
      });
    });

  });

  describe('reruns', function(){

    xit('reruns blocks that made lookup in a scope when target namespace changes', function(){
      var runCount = 0;
      bound.autorun(function(){
        parentScope.lookup('text');
        runCount++;
      });
      expect(runCount).toBe(1);
      message.bound('set', 'text', 'hello');
      expect(runCount).toBe(2);
    });

    xit('if a value is found on an object that is low in the scope chain, and the value at that key is changed on a higher level of the chain, those changes do not result in a rerender of directives that depended on the value in the leaf object', function(){
    });

  });

});
