describe('scope chains', function(){

  it('should provide a scope chain maker function', function(){
    expect(bound.topScopeChain).toEqual(jasmine.any(Object));
    expect(bound.topScopeChain.extend).toEqual(jasmine.any(Function));
  });

  it('should allow lookups in the global scope from the top level scope chain', function(){
    global.present = 3;
    expect(bound.topScopeChain.get('present')).toEqual(3);
    delete global.present;
  });

  it('should preserve object identity when looking up variables', function(){
    global.object = {};
    expect(bound.topScopeChain.get('object')).toBe(object);
    delete global.object;
  });

  it('should fail for lookups in the top level scope chain for keys that are not in the global scope', function(){
    expect(bound.topScopeChain.get('absent')).toEqual(undefined);
  }); 

  it('should allow lookups of number literal', function(){
    expect(bound.topScopeChain.get("3")).toEqual(3);
  });

  it('should allow lookups of big number literal', function(){
    expect(bound.topScopeChain.get("32223")).toEqual(32223);
  });

  it('should allow lookups of number literal that contains 0 in front of it.', function(){
    expect(bound.topScopeChain.get("0032223")).toEqual(32223);
  });      

  it('should allow lookups of number literal that contains 0 middle of it.', function(){
    expect(bound.topScopeChain.get("010023")).toEqual(10023);
  });

  it('should allow lookups for string literals in double qoutes', function(){
    expect(bound.topScopeChain.get('"in doubles"')).toEqual('in doubles');
  });

  it('should allow lookups for empty array literals', function(){
    expect(bound.topScopeChain.get('[]')).toEqual([]);
  });

  it('should allow lookups for array literals that contain whitespace', function(){
    expect(bound.topScopeChain.get('[   ]')).toEqual([]);
  });

  it('should allow lookups for array literals', function(){
    expect(bound.topScopeChain.get("['a', 3, false]")).toEqual(['a', 3, false]);
  });

  xit('should allow lookups for nested array literals', function(){
    expect(bound.topScopeChain.get("[[1], [2], [3]]")).toEqual([[1], [2], [3]]);
  });  

  it('should allow lookups for object literals', function(){
    expect(bound.topScopeChain.get("{key: 'value'}")).toEqual({key: 'value'});
  });

  it('should allow lookups for object literals that has mulifly keys and values', function(){
    expect(bound.topScopeChain.get("{key: 'value', key2: 'value2', key3: 'value3'}")).toEqual({key: 'value', key2: 'value2', key3: 'value3'});
  }); 

  it('should allow lookups for object literals when values are arrays', function(){
    expect(bound.topScopeChain.get("{key: [1,2,3,4], key2: [5,6,7,8], key3: [5,6,7,8]}")).toEqual({key: [1,2,3,4], key2: [5,6,7,8], key3: [5,6,7,8]});
  });

  it('should allow lookups for object literals when values are objects', function(){
    expect(bound.topScopeChain.get("{key: {key4: 'value'}, key2: {key4: 'value2'}, key3: {key4: 'value3'}}")).toEqual({key: {key4: 'value'}, key2: {key4: 'value2'}, key3: {key4: 'value3'}});
  }); 

  it('should allow lookups for boolean values', function(){
    expect(bound.topScopeChain.get("false")).toEqual(false);
    expect(bound.topScopeChain.get("true")).toEqual(true);
  });

  it('should allow lookups for null', function(){
    expect(bound.topScopeChain.get("null")).toEqual(null);
  });

  it('should allow lookups for undefined', function(){
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
