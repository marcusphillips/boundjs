describe('dependencies', function(){

  it('should not rerun any work after calling .bound() on an object that has not changed', function(){
    var runCount = 0;
    bound.proxy(alice);
    bound.autorun(function(){
      alice.get('name');
      runCount = runCount + 1;
    });

    alice.bound();
    expect(runCount).toBe(1);

    alice.set('set', name, 'alice');
    expect(runCount).toBe(1);
  });

});