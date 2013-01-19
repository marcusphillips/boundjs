describe('jquery helpers', function(){

  describe('.namespace()', function(){
    it('provides the top namespace in the scope chain', function(){
      expect($empty.render().namespace()).toEqual(undefined);
      expect($empty.render(alice).namespace()).toEqual(alice);
      expect($empty.render(bob).namespace()).toEqual(bob);
      expect($empty.render(charlie, david).namespace()).toEqual(david);
    });

    xit('returns the namespace inherited from an ancestor when the focal node has no namespace', function(){
      $parent.render(alice);
      expect($child.namespace()).toEqual(alice);
    });

  });

  describe('.namespaces()', function(){
    it('provides all namespaces in the scope chain', function(){
      expect($empty.render().namespaces()).toEqual([global]);
      expect($empty.render(alice).namespaces()).toEqual([global, alice]);
      expect($empty.render(bob).namespaces()).toEqual([global, alice, bob]);
      expect($empty.render(charlie, david).namespaces()).toEqual([global, alice, bob, charlie, david]);
    });
  });

  describe('.scope()', function(){
    it('provides the scope object used for key lookups in the template', function(){
      expect(bound.isBoundScope($empty.scope())).toBe(true);
      expect($empty.render(alice, bob).scope().namespaces()).toEqual([global, alice, bob]);
    });
  });

  describe('.subwidgets()', function(){
    // todo: define a mechanism that retrieves descendant widgets with a given name
    //   when nodes are rendered that have a bound-widget attribute, they are available from their ancestors
    // note - this might not work with jasmine, since it would have to do deep comparison
    expect($widget.subwidgets()).toEqual([$subwidgetA, $subwidgetB]);
    expect($superwidget.subwidgets('widget')).toEqual([$widget]); // todo: toArray() ?
    expect($superwidget.subwidgets('nonexistant').length).toEqual(0);
    expect($superwidget.subwidget('widget')).toEqual($widget);
    expect(function(){
      // when a specifier sent to subwidget() matches more than one widget, it errors
      $superwidget.subwidget('subwidget');
    }).toThrow();
    expect($superwidget.subwidget('nonexistant').length).toEqual(0);
    expect($widget.superwidget()).toEqual($superwidget);
  });

});
