describe('scope chains', function(){
  var global = this;

  xit('should provide a scope chain maker function', function(){
    expect(bound.topScopeChain).toEqual(jasmine.any(Object));
    expect(bound.topScopeChain.extend).toEqual(jasmine.any(Function));
  });

  xit('should allow look ups in the global scope from the top level scope chain', function(){
    global.present = 3;
    expect(bound.topScopeChain.get('present')).toEqual(3);
    expect(bound.topScopeChain.get('absent')).toEqual(undefined);
    delete global.present;
  });

});
