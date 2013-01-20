describe('loop directive', function(){

  xit('should populate a loop directive node with copies of the template node', function(){
    var $children = $friends.render(david).children();
    expect($children.length).to.equal(4);
    expect([
      $children.eq(0).html(),
      $children.eq(1).html(),
      $children.eq(2).html(),
      $children.eq(3).html()
    ]).to.equal(['', 'alice', 'bob', 'charlie']);
  });

});
