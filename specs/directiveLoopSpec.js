describe('proxies', function(){

  xit('should populate a loop directive node with copies of the template node', function(){
    var $children = $friends.render(david).children();
    expect($children.length).toEqual(4);
    expect([
      $children[0].html(),
      $children[1].html(),
      $children[2].html(),
      $children[3].html()
    ]).toEqual(['', 'alice', 'bob', 'charlie']);
  });

});