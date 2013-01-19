describe('contents directive', function(){

  it('modifies the html of a rendered node that has the contents directive', function(){
    expect($name.render(alice).html()).to.equal('alice');
  });

  it('should not modify the contents of a node that does not have a contents directive', function() {
    expect($('<div>original</div>').render(alice).html()).to.equal('original');
  });

  it('does not add any text to the node if the contents key is not found in scope', function() {
    expect($('<div contents="unicorns"></div>').render(alice).html()).to.equal('');
  });

});
