describe('undermore', function(){

  describe('isAncestor', function(){

    it('should return false if the first-argument object is not a parent of the second-argument object', function(){
      expect(_.isAncestor({}, {})).toEqual(false);
    });

    it('should return true if the first-argument object is a parent of the second-argument object', function(){
      expect(_.isAncestor(parent, child)).toEqual(true);
    });

    it('should return false if the argument order is reversed', function(){
      expect(_.isAncestor(child, parent)).toEqual(false);
    });

    it('should return true when testing grandparent relationships', function(){
      var grandparent = {};
      var parent = _.create(grandparent);
      var child = _.create(parent);
      expect(_.isAncestor(grandparent, child)).toEqual(true);
    });

    it('should not imbue an object with a property it did not previously have', function(){
      var parentPreKeys = _.keys(parent);
      var childPreKeys = _.keys(parent);
      _.isAncestor(parent, child);
      var parentPostKeys = _.keys(parent);
      var childPostKeys = _.keys(parent);

      expect(parentPreKeys).toEqual(parentPostKeys);
      expect(childPreKeys).toEqual(childPostKeys);
    });

    it('should not overwrite a pre-existing property on objects', function(){
      parent.ancestryFlag = 'can';
      child.ancestryFlag = 'haz';
      _.isAncestor(parent, child);
      expect(parent.ancestryFlag).toEqual('can');
      expect(child.ancestryFlag).toEqual('haz');
    });

    it('should not overwrite a pre-existing property on objects', function(){
      child.ancestryFlag = 'mask';
      expect(_.isAncestor(parent, child)).toEqual(true);
    });

  });

});
