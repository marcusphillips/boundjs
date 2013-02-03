describe('rendering', function(){

  describe('.render() fundamentals', function(){

    it('adds a .render() method to jQuery objects', function(){
      expect($empty.render).to.be.a('function');
    });

    it('returns the original jquery object from jquery\'s .render()', function(){
      expect($empty.render({})).to.equal($empty);
    });

    // june: todo
    xit('proxies an object that has been rendered against', function(){
      $empty.render(empty);
      expect(bound.isProxied(empty)).to.equal(true);
    });

    xit('adds a bound-widget attribute to the target node', function(){
      expect($empty.render({}).attr('bound-widget') === undefined).to.be(false);
    });

    xit('doesn\'t recurse onto descendant bound widgets', function(){
      $name.render({}).appendTo($empty);
      expect(B.getDirectiveRenderCount()).to.equal(1);
      $empty.render(alice);
      expect(B.getDirectiveRenderCount()).to.equal(1);
      expect($name.html()).to.equal('');
    });

    it('falls through to namespaces that is in middle of scope chain', function(){
      var $node = $('<div>\
        <div bound-with="child">\
          <div bound-with="grandchild" bound-contents="text"></div>\
        </div>\
      </div>');
      $node.render({
        text: 'masked',
        child: {
          text: 'matched',
          grandchild: {}
        }
      });
      expect($node.find('[bound-with=grandchild]').html()).to.equal('matched');
    });

  });

  describe('directive render operation counting', function(){

    it('counts the number of directives processed', function(){
      expect(B.getDirectiveRenderCount()).to.equal(0);
      $name.render(alice);
      expect(B.getDirectiveRenderCount()).to.equal(1);
      B.resetDirectiveRenderCount();
      expect(B.getDirectiveRenderCount()).to.equal(0);
    });

  });

  describe('affected nodes', function(){

    it('does not operate on nodes that have no directives', function(){
      $empty.render({});
      expect(B.getDirectiveRenderCount()).to.equal(0);
    });

    it('operates on all nodes in a single jQuery collection', function(){
      $name.add($age).render(alice);
      expect(B.getDirectiveRenderCount()).to.equal(2);
      expect($name.html()).to.equal('alice');
      expect($age.html()).to.equal('20');
    });

  });

  describe('following directives', function(){

    it('does not remove a directive attribute after following it', function(){
      expect($name.render(alice).attr('bound-contents')).to.equal('name');
    });

    xit('errors when passed an invalid directive name');

    it('updates nodes nested within the top level node', function(){
      $empty.append($name).render(alice);
      expect($name.html()).to.equal('alice');
    });

    it('it should insert contents that are text as text and not as dom nodes', function(){
      expect($message.render({text: '<script>alert("xss");</script>'}).text()).to.equal('<script>alert("xss");</script>');
    });

    it('it should insert contents that are dom nodes as dom nodes and not as text', function(){
      expect($message.render({text: $name}).children()[0]).to.be($name[0]);
      expect(typeof $message.render({text: $name}).children()[0]).to.equal('object');
    });

  });

  describe('scopes and multiple namespace inputs', function(){

    afterEach(function(){
      delete global.age;
    });

    it('falls back onto the global namespace for keys that are not found on the input namespace', function(){
      global.age = 10;
      expect($age.render({}).html()).to.equal('10');
      delete global.age;
    });

  });

  describe('reactive updates', function(){

    it('refollows the directives of all rendered nodes when .bound() is called on a rendered-against namespace that has changed', function(){
      $name.render(alice);
      $age.render(alice);
      _.extend(alice, {name: 'al', age: 24});
      alice.bound();
      clock.tick(0);
      expect($name.html()).to.equal('al');
      expect($age.html()).to.equal('24');
    });

    xit('does not refollow directives for properties that have not change, after calling .bound()', function(){
      $name.render(alice);
      expect(B.getDirectiveRenderCount()).to.be(1);
      // called after no changes, so no directives should be re-run
      alice.bound();
      clock.tick(0);
      expect(B.getDirectiveRenderCount()).to.be(1);
    });

    it('should only update the directives of nodes that were rendered against the object that has .bound() called on it', function(){
      $name.render(alice);
      $name2.render(bob);
      bob.name = 'robert';
      B(alice).set('name', 'al');
      clock.tick(0);
      expect($name.html()).to.equal('al');
      expect($name2.html()).to.equal('bob');
    });

    xit('should rerender nodes that depend on objects changed with .set()', function(){
      var $node = $('<div>\
        <div bound-with="alice" bound-contents="name"></div>\
        <div bound-with="bob" bound-contents="name"></div>\
      </div>');
      $node.render({
        alice: alice,
        bob: bob
      });
      expect(B.getDirectiveRenderCount()).to.equal(4);

      bob.name = 'billy-bob';
      B(alice).set('name', 'al');
      expect($node.find('[bound-with=bob]').html()).to.equal('bob');
      expect($node.find('[bound-with=alice]').html()).to.equal('al');
      expect(B.getDirectiveRenderCount()).to.equal(5);
    });

  });

});
