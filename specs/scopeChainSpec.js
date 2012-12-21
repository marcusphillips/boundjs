describe('scope chains', function(){

  xit('should provide a scope chain maker function', function(){
    expect(bound.topScopeChain).toEqual(jasmine.any(Object));
    expect(bound.topScopeChain.extend).toEqual(jasmine.any(Function));
  });

  xit('should allow lookups in the global scope from the top level scope chain', function(){
    global.present = 3;
    expect(bound.topScopeChain.get('present')).toEqual(3);
    delete global.present;
  });

  xit('should preserve object identity when looking up variables', function(){
    global.object = {};
    expect(bound.topScopeChain.get('object')).toBe(object);
    delete global.object;
  });

  xit('should fail for lookups in the top level scope chain for keys that are not in the global scope', function(){
    expect(bound.topScopeChain.get('absent')).toEqual(undefined);
  }); 

  xit('should allow lookups of number literal', function(){
    expect(bound.topScopeChain.get("3")).toEqual(3);
  });

  xit('should allow lookups for string literals in double qoutes', function(){
    expect(bound.topScopeChain.get('"in doubles"')).toEqual('in doubles');
  });

  xit('should allow lookups for string literals in single quotes', function(){
    expect(bound.topScopeChain.get("'in singles'")).toEqual('in singles');
  });

  it('should allow lookups for array literals', function(){
    expect(bound.topScopeChain.get("['a', 3, false]")).toEqual(['a', 3, false]);
  });

  xit('should allow lookups for object literals', function(){
    expect(bound.topScopeChain.get("{key: 'value'}")).toEqual({key: 'value'});
  });

  xit('should allow lookups for boolean values', function(){
    expect(bound.topScopeChain.get("false")).toEqual(false);
    expect(bound.topScopeChain.get("true")).toEqual(true);
  });

  xit('should allow lookups for null', function(){
    expect(bound.topScopeChain.get("null")).toEqual(null);
  });

  xit('should allow lookups for undefined', function(){
    expect(bound.topScopeChain.get("undefined")).toEqual(undefined);
  });

  xit('should allow lookups for objects composed from variable substitutions', function(){
    global.greeting = 'hello';
    expect(bound.topScopeChain.get('{key: greeting}')).toEqual({key: 'hello'});
    delete global.greeting;
  });

  xit('', function(){
    expect(bound.topScopeChain.get('alice.name')).toEqual('alice');
  });

  xit('should allow you to create child scope chains that delegate upwards', function(){
  });

});
