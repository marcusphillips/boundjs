describe('proxies', function(){

  xit('should return the input object as a result of calling bound()', function(){
    var user = {name:'alice'};
    expect(bound(user)).toEqual(user);
  });

  xit('should augment objects passed into bound() with a .boundControl() method', function(){
    expect(bound({}).boundControl).toEqual(jasmine.any(Function));
  });

});
