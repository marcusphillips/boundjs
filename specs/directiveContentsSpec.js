describe('bound-contents directive', function(){

  it('modifies the html of a rendered node that has the bound-contents directive', function(){
    expect($name.render(alice).html()).toEqual('alice');
  });

  it('should not modify the contents of a node that does not have a bound-contents directive', function() {
    expect($('<div>original</div>').render(alice).html()).toEqual('original');
  });

  it('does not add any text to the node if the bound-contents key is not found in scope', function() {
    expect($('<div contents="unicorns"></div>').render(alice).html()).toEqual('');
  });

});
