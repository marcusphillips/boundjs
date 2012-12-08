describe('render', function(){
  it('adds a .bound() method to jQuery objects', function(){
    expect($('<div></div>').bound).toEqual(jasmine.any(Function));
  });

  it('can add html to a node', function(){
    var $node = $('<div contents="name"></div>');
    $node.bound({name: 'alice'});
    expect($node.html()).toEqual('alice');
  });

  it('falls back onto the global scope for keys that are not found on the input', function(){
    var global = (function(){ return this; }());
    global.age = '30';
    var $node = $('<div contents="age"></div>');
    $node.bound({name: 'alice'});
    expect($node.html()).toEqual('30');
    delete global.age;
  });

  it('does not remove a directive attribute after following it', function(){
    var $node = $('<div contents="name"></div>');
    $node.bound({name: 'alice'});
    expect($node.attr('contents')).toEqual('name');
  });
});
