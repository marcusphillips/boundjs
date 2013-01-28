describe('underscoreMethod', function(){

  describe('using underscore method on a proxy target', function(){
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

    // each
    it('should iterate through each value in an array', function(){
      var callcount = 0;
      B(oldArray).each(function(){ callcount++; });
      expect(callcount).to.equal(5);
    });

    // map
    it('should return a new array of values by mapping each value in a list through a transformation callback function', function(){
      expect(B(oldArray).map(function(v){ return v + 1; })).to.eql([2,3,4,5,6]);
    });

    // reduce
    it('should return a single value that has been boiled down from an array of values', function(){
      expect(B(oldArray).reduce(function(m, v){ return m + v; },1)).to.equal(16);
    });

    // find
    it('should return the first value that passes a truth test', function(){
      expect(B(oldArray).find(function(v){ return v % 2 === 0; })).to.equal(2);
    });

    // filter
    it('should return an array of all the values that passed a truth test', function(){
      expect(B(oldArray).filter(function(v){ return v % 2 === 0; })).to.eql([2,4]);
    });

    it('should return true if all of the values in an array pass a truth test', function(){
      expect(B([true, 1, 'yes']).every(_.identity)).to.eql(true);
    });

    // some
    it('should return true if some of the values in an array pass a truth test', function(){
      expect(B([true, 1, 'yes', false]).some(_.identity)).to.eql(true);
    });

    // contains
    it('should return false if the value is in the array', function(){
      expect(B(oldArray).contains(7)).to.eql(false);
    });

    // where
    it('should return the number of values in a list.', function(){
      expect(_.size(B(arrayObjs).where({age:33}))).to.equal(2);
    });

    // reject
    it('should return an array of values that do not pass a truth test', function(){
      expect(B(oldArray).reject(function(v){ return v % 2 === 0; })).to.eql([1,3,5]);
    });

    // max
    it('should return the maximum value from an array', function(){
      expect(B(oldArray).max()).to.equal(5);
    });

    // min
    it('should return the minimum value from an array', function(){
      expect(B(oldArray).min()).to.equal(1);
    });

    // pluck
    it('should extract a list of property values from an array of objects', function(){
      expect(B(arrayObjs).pluck('name')).to.eql(['alice', 'bob', 'alex']);
    });

    // groupBy
    it('should return the result of running each value in an array through an iterator, grouped by result', function(){
      expect(B([1.3, 1.4, 2.9, 4.1]).groupBy(function(n){ return Math.floor(n); })).to.eql({1: [1.3, 1.4], 2: [2.9], 4: [4.1]});
    });

    // countBy
    it('should sort a list into groups and return a count for the number of objects in each group', function(){
      expect(B(oldArray).countBy(function(n){ return n % 2 == 0 ? 'even' : 'odd'; }).odd).to.equal(3);
    });

    // shuffle
    it('should return a new array of shuffled proxy objects', function(){
      expect(_.contains(B(oldArray).shuffle(), 3)).to.equal(true);
    });

    // toArray
    it('should return an array of proxy objects', function(){
      var argReturner = function(){ return arguments; };
      var args = argReturner(1,2,3);
      expect(B(args).toArray()).to.eql([1,2,3]);
    });

    // size
    it('should return the size of a proxy object', function(){
      expect(B(oldArray).size()).to.equal(5);
    });

    // ARRAYS
    // initial
    it('should return everything but the last 2 elements from result', function(){
      expect(B(oldArray).initial(2)).to.eql([1,2,3]);
    });

    // first
    it('should return the first element from an array', function(){
      expect(B(oldArray).first()).to.equal(1);
    });

    // last
    it('should return the last element from an array', function(){
      expect(B(oldArray).last()).to.equal(5);
    });

    // rest
    it('should tak an index and return the elements in an array from that index forward', function(){
      expect(B(oldArray).rest(2)).to.eql([3,4,5]);
    });

    // compact
    it('should return a copy of an array with all falsy values removed', function(){
      expect(B([false, '', null, 0]).compact()).to.eql([]);
    });

    // flatten
    it('should return a new flattened array', function(){
      expect(B([[1,[2],3],4,5]).flatten()).to.eql(oldArray);
    });

    //without
    it('should return a new array with all instances of 0 and 6 removed', function(){
      expect(B([0,1,2,3,4,5,6]).without(0, 6)).to.eql(oldArray);
    });

    // union
    it('should return new array that computes the union of the passed-in arrays', function(){
      expect(B([1,2,3]).union([2,3,4],[4,5])).to.eql(oldArray);
    });

    // intersection
    it('should return an array of all the values which are the intersection of all the arrays', function(){
      expect(B(oldArray).intersection([1,2],[1,4])).to.eql([1]);
    });

    // difference
    it('should return the values from an array that are not present in the other arrays',function(){
      expect(B(oldArray).difference([1,2],[1,4])).to.eql([3,5]);
    });

    // uniq
    it('should produce a duplicate-free version of the array',function(){
      expect(B([1,2,3,4,5,5]).uniq()).to.eql(oldArray);
    });

    // zip
    it('should merge together the values of each of the arrays',function(){
     expect(B(['Bonnie', 'yes']).zip(['and', 'or'],['Clyde', 'no'])).to.eql([['Bonnie','and','Clyde' ], ['yes', 'or','no']]);
    });

    // BEGIN TONY
    // object
    // it('should convert an array into an object',function(){
    //   expect(B(['alice', 'bob', 'alex']).object([30, 40, 50]))to.eql({moe: 30, larry: 40, curly: 50});
    // });

    // indexOf
    it('should return the index at which a value can be found in the array',function(){
      expect(B([1, 2, 3]).indexOf(2)).to.eql(1);
      expect(B([10, 20, 30, 40, 50]).indexOf(35, true)).to.eql(-1);
      // expect(B(null).indexOf(2)).to.eql(-1); // should handle null properly
      expect(B([10, 20, 30, 40, 50]).indexOf(40)).to.eql(3);
      expect(B([1, 40, 40, 40, 40, 40, 40, 40, 50, 60, 70]).indexOf(40)).to.eql(1);
      expect(B([1, 2, 3, 1, 2, 3, 1, 2, 3]).indexOf(2, 5)).to.eql(7); // should support the fromIndex argument
    });

    // lastIndexOf
    it('should return the index of the last occurrence of a value in an array, or -1 if value is not present',function(){
      expect(B([1, 0, 1]).lastIndexOf(1)).to.eql(2);
    });

    // sortedIndex
    it('should ',function(){
      expect();
    });

    // range
    it('should ',function(){
      expect();
    });

  });

});
