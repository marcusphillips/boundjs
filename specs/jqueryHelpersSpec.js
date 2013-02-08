describe('jquery helpers', function(){

  describe('.namespace()', function(){
    xit('provides the top namespace in the scope chain', function(){
      expect($empty.render().namespace()).to.equal(undefined);
      expect($empty.render(alice).namespace()).to.equal(alice);
      expect($empty.render(bob).namespace()).to.equal(bob);
      expect($empty.render(charlie, david).namespace()).to.equal(david);
    });

    xit('returns the namespace inherited from an ancestor when the focal node has no namespace', function(){
      $parent.render(alice);
      expect($child.namespace()).to.equal(alice);
    });

  });

  describe('.namespaces()', function(){
    xit('provides all namespaces in the scope chain', function(){
      expect($empty.render().namespaces()).to.equal([global]);
      expect($empty.render(alice).namespaces()).to.equal([global, alice]);
      expect($empty.render(bob).namespaces()).to.equal([global, alice, bob]);
      expect($empty.render(charlie, david).namespaces()).to.equal([global, alice, bob, charlie, david]);
    });
  });

  describe('.scope()', function(){
    xit('provides the scope object used for key lookups in the template', function(){
      expect(bound.isBoundScope($empty.scope())).to.be(true);
      expect($empty.render(alice, bob).scope().namespaces()).to.equal([global, alice, bob]);
    });
  });

  describe('.subwidgets()', function(){
    xit('', function(){
      // todo: define a mechanism that retrieves descendant widgets with a given name
      //   when nodes are rendered that have a bound-widget attribute, they are available from their ancestors
      // note - this might not work with jasmine, since it would have to do deep comparison
      expect($widget.subwidgets()).to.equal([$subwidgetA, $subwidgetB]);
      expect($superwidget.subwidgets('widget')).to.equal([$widget]); // todo: toArray() ?
      expect($superwidget.subwidgets('nonexistant').length).to.equal(0);
      expect($superwidget.subwidget('widget')).to.equal($widget);
      expect(function(){
        // when a specifier sent to subwidget() matches more than one widget, it errors
        $superwidget.subwidget('subwidget');
      }).to.throwException();
      expect($superwidget.subwidget('nonexistant').length).to.equal(0);
      expect($widget.superwidget()).to.equal($superwidget);

    });
  });

});
