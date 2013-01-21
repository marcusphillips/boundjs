describe('underscoreMethod', function(){

  describe('using unserscore method on proxy target', function(){
    var oldArray;
    var arrayObjs;
    beforeEach(function(){
      oldArray = [1,2,3,4,5];
      arrayObjs = [
        {name:'alice', age:33},
        {name:'bob', age:33},
        {name:'alex', age:44}
      ];
    });

    it('iterates through each value in array', function(){
      var callcount = 0;
      B(oldArray).each(function(){ callcount++; });
      expect(callcount).to.equal(5);
    });

    it('should return a new array of values by mapping each value in list through a transformation call back function', function(){
      expect(B(oldArray).map(function(v){ return v + 1; })).to.eql([2,3,4,5,6]);
    });

    it('should return single value that has been boiled down from array of values', function(){
      expect(B(oldArray).reduce(function(m, v){ return m + v; },1)).to.equal(16);
    });

    it('should return the first value that passes truth test', function(){
      expect(B(oldArray).find(function(v){ return v % 2 === 0; })).to.equal(2);
    });

    it('should return an array of all the values that passed truth test', function(){
      expect(B(oldArray).filter(function(v){ return v % 2 === 0; })).to.eql([2,4]);
    });

    it('should return true if all of the values in array pass truth test', function(){
      expect(B([true, 1, 'yes']).every(_.identity)).to.eql(true);
    });

    it('should return true if some of the values in array pass truth test', function(){
      expect(B([true, 1, 'yes', false]).some(_.identity)).to.eql(true);
    });

    it('should return false if value is in the array', function(){
      expect(B(oldArray).contains(7)).to.eql(false);
    });

    it('should return an array of all the value that contains all of the key-value', function(){
      expect(_.size(B(arrayObjs).where({age:33}))).to.equal(2);
    });

    it('should return an array of values without the elements that the truth test passes', function(){
      expect(B(oldArray).reject(function(v){ return v % 2 === 0; })).to.eql([1,3,5]);
    });

    it('should return maximum value from array', function(){
      expect(B(oldArray).max()).to.equal(5);
    });

    it('should return minimum value from array', function(){
      expect(B(oldArray).min()).to.equal(1);
    });

    it('pluck', function(){
      expect(B(arrayObjs).pluck('name')).to.eql(['alice', 'bob', 'alex']);
    });

    it('should return new object that has been sorted by interator condition', function(){
      expect(B([1.3, 1.4, 2.9, 4.1]).groupBy(function(n){ return Math.floor(n); })).to.eql({1: [1.3, 1.4], 2: [2.9], 4: [4.1]});
    });

    it('countBy', function(){
      expect(B(oldArray).countBy(function(n){ return n % 2 == 0 ? 'even' : 'odd'; }).odd).to.equal(3);
    });

    it('should return new array of shuffled proxy object', function(){
      expect(_.contains(B(oldArray).shuffle(), 3)).to.equal(true);
    });

    it('should return an array of proxy object', function(){
      var argReturner = function(){ return arguments; };
      var args = argReturner(1,2,3);
      expect(B(args).toArray()).to.eql([1,2,3]);
    });

    it('should return size of proxy object', function(){
      expect(B(oldArray).size()).to.equal(5);
    });

    it('should return everything but last 2 elements from result', function(){
      expect(B(oldArray).initial(2)).to.eql([1,2,3]);
    });

    it('should return first element from array', function(){
      expect(B(oldArray).first()).to.equal(1);
    });

    it('should return last element from array', function(){
      expect(B(oldArray).last()).to.equal(5);
    });

    it('should return rest of elements from array', function(){
      expect(B(oldArray).rest(2)).to.eql([3,4,5]);
    });

    it('should return a new array with all falsy values removed', function(){
      expect(B([false, '', null, 0]).compact()).to.eql([]);
    });

    it('should return new flattened array', function(){
      expect(B([[1,[2],3],4,5]).flatten()).to.eql(oldArray);
    });

    it('should return new array with all instances of the values removed', function(){
      expect(B([0,1,2,3,4,5,6]).without(0, 6)).to.eql(oldArray);
    });

    it('should return new array that computes the union of the passed in arrays', function(){
      expect(B([1,2,3]).union([2,3,4],[4,5])).to.eql(oldArray);
    });

    it('should return array of all the values which are intersection of all the arrays', function(){
      expect(B(oldArray).intersection([1,2],[1,4])).to.eql([1]);
    });

    it('should return the values from array that are not present in the other arrays',function(){
      expect(B(oldArray).difference([1,2],[1,4])).to.eql([3,5]);
    });

    it('should produces a duplicate-free version of the array',function(){
      expect(B([1,2,3,4,5,5]).uniq()).to.eql(oldArray);
    });

    it('should merges together the values of each of the arrays',function(){
     expect(B(['Bonnie', 'yes']).zip(['and', 'or'],['Clyde', 'no'])).to.eql([['Bonnie','and','Clyde' ], ['yes', 'or','no']]);
    });

  });

});
