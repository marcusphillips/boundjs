describe('scopes', function(){

  var parentScope, childScope;

  beforeEach(function(){
    parentScope = bound.scope.extend(message);
    childScope = parentScope.extend(alice);
  });

  describe('basics', function(){

    xit('introduces a top level scope', function(){
      expect(bound.scope).toEqual(any(Object));
    });

    xit('can create subscopes', function(){
      expect(bound.scope.extend).toEqual(any(Function));
    });

    xit('can provide the parent scope', function(){
      expect(childScope.parent()).toEqual(parentScope);
    });

  });

  describe('lookups', function(){

    xit('allows lookups in the global scope from the top level scope', function(){
      global.present = 3;
      expect(bound.scope.get('present')).toEqual(3);
      expect(bound.scope.get('absent')).toEqual(undefined);
      delete global.present;
    });

    xit('lookups in a child scope fall through to the parent scope', function(){
      expect(childScope.get('text')).toEqual('hi');
    });

  });

  describe('literals', function(){

    xit('should allow lookups of literal objects, arrays, and strings with double and single quotes', function(){
      _.each({
        '3': 3,
        '"in doubles"': 'in doubles',
        "'in singles'": 'in singles',
        "[]": [],
        "{}": {},
        "false": false,
        "true": true,
        "null": null,
        "undefined": undefined,
        'absent': undefined,
        '{key: text}': {key: 'hi'},
        'bob.name': 'bob'
      }, function(key, value){
        expect(childScope.lookup(key)).toEqual(value);
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
