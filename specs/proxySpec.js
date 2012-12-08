describe('proxies', function(){
  it('should return the input object as a result of calling bound()', function(){
    var user = {name:'alice'};
    expect(bound(user)).toEqual(user);
  });

  it('should augment objects passed into bound() with a .bound() method', function(){
    expect(bound({}).bound).toEqual(jasmine.any(Function));
  });

});
