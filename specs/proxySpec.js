describe('proxies', function(){

  xit('should return the input object as a result of calling bound()', function(){
    expect(bound.proxy(alice)).toEqual(alice);
  });

  xit('should augment objects passed into bound.proxy() with a .bound() method', function(){
    expect(bound.proxy({}).bound).toEqual(jasmine.any(Function));
  });

  xit('should let you invalidate listeners for one key by exposing a bound() command "changed"', function(){
    var runCount = 0;
    bound.autorun(function() {
      alice.bound('get', 'name');
      runCount++;
    });
    expect(runCount).toEqual(1);
    alice.name = 'al';
    alice.bound('changed', 'name');
    expect(runCount).toEqual(2);
    alice.age = 21;
    alice.bound('changed', 'age');
    expect(runCount).toEqual(2);
  });

});
