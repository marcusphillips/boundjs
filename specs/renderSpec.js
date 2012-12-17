describe('render', function(){
  var global = (function(){ return this; }());

  beforeEach(function(){
    bound.resetDirectiveRenderCount();
  });

  it('adds a .render() method to jQuery objects', function(){
    expect($empty.render).toEqual(any(Function));
  });

  it('returns the original jquery object from jquery\'s .render()', function(){
    expect($empty.render({})).toEqual(any(jQuery));
  });

  it('modifies the html of a rendered node that has the contents directive', function(){
    expect($name.render(alice).html()).toEqual('alice');
  });

  it('falls back onto the global scope for keys that are not found on the input', function(){
    global.food = 'sausage';
    expect($('<div contents="food"></div>').render(alice).html()).toEqual('sausage');
    delete global.food;
  });

  it('counts the number of directives processed', function(){
    global.drink = 'coffee';
    expect(bound.getDirectiveRenderCount()).toEqual(0);     // check that count is at zero
    $('<div contents="food"></div>').render(alice);         // render something with one directive
    expect(bound.getDirectiveRenderCount()).toEqual(1);     // check that count is at 1
    // $('<div contents="food" contents="coffee"></div>').render(alice)  // render something with 2 directives
    // expect(bound.getDirectiveRenderCount()).toEqual(3);               // check that count is at 3
    bound.resetDirectiveRenderCount();                      // reset counter
    expect(bound.getDirectiveRenderCount()).toEqual(0);     // check that count is at 0
  });

  xit('does not operate on nodes that have no directives', function(){
    $empty.render({})
    expect(bound.getDirectiveRenderCount()).toEqual(0);
  });

  it('does not add any text to the node if the directive attribute is not found on the input and in the global scope', function() {
    expect($('<div contents="unicorns"></div>').render(alice).html()).toEqual('');
  });

  it('throws an error (TypeError) if no context is passed', function() {
    expect(function(){$empty.render();}).toThrow();
  });

  it('does not remove a directive attribute after following it', function(){
    expect($name.render(alice).attr('contents')).toEqual('name');
  });

  it('adds a .bound() method to objects that have been rendered against', function(){
    var object = {};
    $empty.render(object);
    expect(object.bound).toEqual(any(Function));
  });

  it('updates the html property by calling the .bound() method on a rendered-against scope that has changed', function(){
    $name.render(alice);
    _.extend(alice, {name: 'al'}).bound();
    jasmine.Clock.tick(0);
    expect($name.html()).toEqual('al');
  });


  it('should update the html property of all nodes that it has been rendered against', function(){
    $name.render(alice);
    $age.render(alice);
    alice.name = 'al';
    alice.age = 24;
    alice.bound();
    jasmine.Clock.tick(0);
    expect($name.html()).toEqual('al');
    expect($age.html()).toEqual('24');
  });

  it('should only update the html property of nodes in the current context when bound() is called', function(){
    $name.render(alice);
    $name2.render(bob);
    alice.name = 'al';
    bob.name = 'robert';
    alice.bound();
    jasmine.Clock.tick(0);
    expect($name.html()).toEqual('al');
    expect($name2.html()).toEqual('bob');
  });

  describe('directives', function(){
    it('should handle the bound-attr directive, by adding an attribute with the supplied attribute name and value', function(){
      var $node = $('<div attr-foo="name"></div>');
      $node.render(alice);
      expect($node.attr('foo')).toEqual('alice');
    });
  });

  xit('should add attributes when the bound-attr directive is present', function(){
    var $node = $(
      '<div id="a" attr-foo="name">'
        + '<div id="b" attr-foo="age"></div>'
        + '<div id="c" attr-foo="username"></div>'
      + '</div>'
    );
    $node.render(alice);
    expect($node.attr('foo')).toEqual('alice');
    expect($node.find('#b').attr('foo')).toEqual('20');
    expect($node.find('#c').attr('foo')).toEqual('alice00');
  });

  xit('should update nodes nested within the top level node', function(){
  });

  xit('should update only the values associated with keys passed in to .bound()', function(){
  });

  xit('if a value is found on an object found low in the scope chain, and the value of at that key is changed on a higher level of the chain, those changes do not result in a rerender of the node that depended on the leaf object', function(){
  });

});
