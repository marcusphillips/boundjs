describe('underscoreMethode', function(){

  describe('each, map, reduce', function(){
    var oldArray;
    beforeEach(function(){
      oldArray = [1,2,3,4,5];
    });

    it('iterates through each value in array', function(){
      var callcount = 0
      B(oldArray).each(function(){ callcount++; })
      expect(callcount).to.equal(5);
    });

    it('return new array that holds modified values with call back function', function(){
      expect(B(oldArray).map(function(v){ return v+1 })).to.eql([2,3,4,5,6]);
    });

    it('return sum up an array', function(){
      expect(B(oldArray).reduce(function(m, v){ return m+v })).to.equal(15);
    });

  });

});
