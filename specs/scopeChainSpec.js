describe('scope chains', function(){

  xit('should provide a scope chain maker function', function(){
    expect(bound.topScopeChain).toEqual(jasmine.any(Object));
    expect(bound.topScopeChain.extend).toEqual(jasmine.any(Function));
  });

  xit('should allow lookups in the global scope from the top level scope chain', function(){
    global.present = 3;
    expect(bound.topScopeChain.get('present')).toEqual(3);
    expect(bound.topScopeChain.get('absent')).toEqual(undefined);
    delete global.present;
  });

  xit('should allow lookups of literal objects, arrays, and strings with double and single quotes', function(){
    expect(bound.topScopeChain.get("3")).toEqual(3);
    expect(bound.topScopeChain.get('"in doubles"')).toEqual('in doubles');
    expect(bound.topScopeChain.get("'in singles'")).toEqual('in singles');
    expect(bound.topScopeChain.get("[]")).toEqual([]);
    expect(bound.topScopeChain.get("{}")).toEqual({});
    expect(bound.topScopeChain.get("false")).toEqual(false);
    expect(bound.topScopeChain.get("true")).toEqual(true);
    expect(bound.topScopeChain.get("null")).toEqual(null);
    expect(bound.topScopeChain.get("undefined")).toEqual(undefined);
    expect(bound.topScopeChain.get('absent')).toEqual(undefined);
    global.greeting = 'hello';
    expect(bound.topScopeChain.get('{key: greeting}')).toEqual({key: 'hello'});
    delete global.greeting;
    expect(bound.topScopeChain.get('alice.name')).toEqual('alice');
    expect(bound.topScopeChain.get(''));
  });

  xit('should allow you to create child scope chains that delegate upwards', function(){
  });

});
