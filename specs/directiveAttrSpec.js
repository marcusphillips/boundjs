describe('attr', function(){

  it('should handle the attr directive, by adding an attribute with the supplied attribute name and value', function(){
    var $node = $('<div bound-attr-foo="name"></div>');
    $node.render(alice);
    expect($node.attr('foo')).to.equal('alice');
  });

});
