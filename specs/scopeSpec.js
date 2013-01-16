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

    it('extend function returns object', function(){
      expect(bound.scope.extend({})).toEqual(any(Object));
    })

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

    it('should allow lookups of literal objects and arrays strings with double and single quotes', function(){
      _.each({
        "[]": [],
        '[  ]': [],
        '["a", 3, false]': ['a', 3, false],
        '[[1], [2], [3]]': [[1], [2], [3]],
        '{}': {},
        '{key: [1,2,3,4]}': {key: [1,2,3,4]},
        '{key : "value"}': {key:'value'},
        '{key: {key4: "value"}}': {key: {key4: 'value'}},
        '{key: text}': {key: 'hi'},
        '{"key" : "value"}': {key : "value"}
      }, function(value, key){
        if(key === '{key: {key4: "value"}}'){
          debugger;
        }
        expect(bound.scope.extend(message).lookup(key)).toEqual(value);
      });
    });

    it('should allow lookups of literal booleans, numbers and strings with double and single quotes', function(){
      _.each({
        '3': 3,
        '100': 100,
        '01': 01,
        '"in doubles"': 'in doubles',
        "'in singles'": 'in singles',
        'false': false,
        'true': true,
        'null': null,
        'undefined': undefined,
        'absent': undefined,
        'trueish': undefined,
        'nully': undefined,
        ' " this string starts with 3 spaces" ': ' this string starts with 3 spaces',
        ' "this string has the escaped delimiter symbol \\" in it" ': 'this string has the escaped delimiter symbol " in it',
        '-1' : -1,
        '0.14': 0.14,
        'zero': 0,
        'masking': undefined
        // 'bob.name': 'bob'
      }, function(value, key){
        expect(bound.scope.extend({
          zero: 0,
          masking: 'masked'
        }).extend({
          masking: undefined
        }).lookup(key)).toBe(value);
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
