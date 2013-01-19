describe('undermore', function(){

  describe('isAncestor', function(){

    it('should return false if the first-argument object is not a parent of the second-argument object', function(){
      expect(_.isAncestor({}, {})).to.equal(false);
    });

    it('should return true if the first-argument object is a parent of the second-argument object', function(){
      expect(_.isAncestor(parent, child)).to.equal(true);
    });

    it('should return false if the argument order is reversed', function(){
      expect(_.isAncestor(child, parent)).to.equal(false);
    });

    it('should return true when testing grandparent relationships', function(){
      expect(_.isAncestor(grandparent, child)).to.equal(true);
    });

    it('should not imbue an object with a property it did not previously have', function(){
      var parentPreKeys = _.keys(parent);
      var childPreKeys = _.keys(child);
      _.isAncestor(parent, child);

      expect(parentPreKeys).to.eql(_.keys(parent));
      expect(childPreKeys).to.eql(_.keys(child));
    });

    it('should not overwrite a pre-existing property on objects', function(){
      parent.ancestryFlag = 'can';
      child.ancestryFlag = 'haz';
      _.isAncestor(parent, child);
      expect(parent.ancestryFlag).to.equal('can');
      expect(child.ancestryFlag).to.equal('haz');
    });

    it('should work if the child already has a value at the ancestryFlag key', function(){
      child.ancestryFlag = 'mask';
      expect(_.isAncestor(parent, child)).to.equal(true);
    });

  });

});
