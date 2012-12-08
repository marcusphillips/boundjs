describe('scope chains', function(){
  it('should provide a scope chain maker function', function(){
    expect(bound.makeScopeChain).toEqual(jasmine.any(Function));
  });
});
