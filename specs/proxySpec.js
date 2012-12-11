describe('proxies', function(){

  xit('should return the input object as a result of calling bound()', function(){
    var user = {name:'alice'};
    expect(bound(user)).toEqual(user);
  });

  xit('should augment objects passed into bound() with a .boundControl() method', function(){
    expect(bound({}).boundControl).toEqual(jasmine.any(Function));
  });

  xit('should let you invalidate listeners for one key by exposing a ctrl() command "changed"', function(){
    var user = bound.proxy({name: 'alice'});
    var runCount = 0;
    bound.autorun(function() {
      user.ctrl('get', 'name');
      runCount++;
    });
    expect(runCount).toEqual(1);
    user.name = 'al';
    user.ctrl('changed', 'name');
    expect(runCount).toEqual(2);
  });

});
