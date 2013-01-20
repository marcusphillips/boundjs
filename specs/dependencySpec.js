describe('dependencies', function(){

  it('should not rerun any work after calling .bound() on an object that has not changed', function(){
    var runCount = 0;
    B(alice);
    bound.autorun(function(){
      B(alice).get('name');
      runCount = runCount + 1;
    });

    B(alice);
    expect(runCount).to.be(1);

    B(alice).set('name', 'alice');
    expect(runCount).to.be(1);
  });

});
