describe('undermore', function(){

  describe('isAncestor', function(){

    it('should return false if an object does not have a parent', function(){
      var notParent = {};
      var notChild = {};
      expect(_.isAncestor(notParent, notChild)).toEqual(false);
    });

    it('should return true if an object has a parent', function(){
      expect(_.isAncestor(parent, child)).toEqual(true);
    });

    it('should not imbue an object with a property it did not previously have', function(){
      _.isAncestor(parent, child);
      expect(parent.hasOwnProperty('ancestryFlag')).toEqual(false);
      expect(child.hasOwnProperty('ancestryFlag')).toEqual(false);
    });

    it('should not overwrite a pre-existing property on objects', function(){
      parent.ancestryFlag = 'can';
      child.ancestryFlag = 'haz';
      _.isAncestor(parent, child);
      expect(parent.ancestryFlag).toEqual('can');
      expect(child.ancestryFlag).toEqual('haz');
    });

  });

});
