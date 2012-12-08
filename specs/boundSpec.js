describe('render', function(){
  it('adds a .bound() method to jQuery objects', function(){
    expect($('<div></div>').bound).toEqual(jasmine.any(Function));
  });

  it('can add html to a node', function(){
    var user = {name: 'alice'};
    var $node = $('<div contents="name"></div>');
    render($node, user);
    expect($node.html()).toEqual('alice');
  });

  it('does not remove a directive attribute after following it', function(){
    var $node = $('<div contents="name"></div>');
    $node.bound({name: 'alice'});
    expect($node.attr('contents')).toEqual('name');
  });
});
