describe('loop directive', function(){

  describe('when rendering a loop node against an empty array', function(){

    it('does only one directive render operation', function(){
      $friends.render(alice);
      expect(B.getDirectiveRenderCount()).to.equal(1);
    });

  });

  describe('when rendering a loop node against an array of size 3', function(){
    xit('indent this whole block when the diff won\'t create conflicts');

  var $children;

  beforeEach(function(){
    $children = $friends.render(david).children();
  });

  it('does seven directive render operations, one for the looping, one with-item for each item, and one contains directive for each item', function(){
    expect(B.getDirectiveRenderCount()).to.equal(7);
  });

  it('populates the loop node with copies of the template node, following the item template node', function(){
    expect($children.length).to.equal(4);
  });

  it('the item template is unchanged', function(){
    expect($children[0]).to.equal($friendsItemTemplate[0]);
  });

  it('renders populate a loop directive node with copies of the template node', function(){
    expect([
      $children.eq(1).html(),
      $children.eq(2).html(),
      $children.eq(3).html()
    ]).to.eql(['alice', 'bob', 'charlie']);
  });

  it('does not apply any render directives to the template directive', function(){
    expect($children.eq(0).html()).to.equal('');
  });

  xit('doesn\'t recurse into nodes when the bound-loop directive resolves to a non-iterable property', function(){
  });

  xit('extends the scope of generated child nodes with the looped-over object, and the indexed item', function(){
  });

  it('does not leave the bound-item-template attribute on the generated nodes', function(){
    $children.each(function(index){
      if(index !== 0){
        expect($(this).attr('bound-item-template')).to.be(undefined);
      }
    });
  });

  });

  xit('doesn\'t discard the existing bound-with attribute of generated item nodes', function(){
  });

  xit('removes superfluous nodes that existed before the loop update occurred', function(){
  });

  xit('re-uses nodes found after the item template assuming they are clones of the of the item directives, leaving all existing event handlers and other state', function(){
  });

  xit('copies event handlers and data from the item template node', function(){
  });

  xit('does not remove event handlers from nodes that have been taken out of the tree as a result of following the loop directive', function(){
  });

  xit('hides a node with a loop directive that targets a non-enumerable');

  xit('re-shows a node with a loop directive that once targeted a non-enumerable but now targets an enumerable');

});
