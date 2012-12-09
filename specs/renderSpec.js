describe('render', function(){
  var global = (function(){ return this; }());

  it('adds a .boundRender() method to jQuery objects', function(){
    expect($('<div/>').boundRender).toEqual(jasmine.any(Function));
  });

  it('returns the original jquery object from .boundRender()', function(){
    expect($('<div/>').boundRender({})).toEqual(jasmine.any(jQuery));
  });

  it('modifies the html of a rendered node that has the contains directive', function(){
    expect($('<div contents="name"></div>').boundRender({name: 'alice'}).html()).toEqual('alice');
  });

  it('falls back onto the global scope for keys that are not found on the input', function(){
    global.age = '30';
    var $node = $('<div contents="age"></div>');
    $node.boundRender({name: 'alice'});
    expect($node.html()).toEqual('30');
    delete global.age;
  });

  it('does not remove the directive attribute after following it', function(){
    var $node = $('<div contents="name"></div>');
    $node.boundRender({name: 'alice'});
    expect($node.attr('contents')).toEqual('name');
  });

  it('adds a .boundControl() method to objects that have been rendered against', function(){
    var user = {name: 'alice'};
    $('<div></div>').boundRender(user);
    expect(user.boundControl).toEqual(jasmine.any(Function));
  });

  xit('recalculates the inner html of a rendered node after calling the .boundControl() method of a rendered-against scope that has since changed', function(){
    var $node = $('<div contents="name"></div>');
    var user = {name: 'alice'};
    $node.boundRender(user);
    user.name = 'al';
    user.boundControl();
    expect($node.html()).toEqual('al');
  });

  xit('should update nodes nested within the top level node', function(){
  });

  xit('should update only the values associated with keys passed in to .boundControl()', function(){
  });

});
