'use strict';

import MemoryCache from '../src/MemoryCache';

describe('MemoryCache', () => {
  let clock = null;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('should be a function', () => {
    return expect(MemoryCache).to.be.a('function');
  });

  it('should returns a decorator function', () => {
    let decorator = MemoryCache();
    return expect(decorator).to.be.a('function');
  });

  class SomeTestClass {
    @MemoryCache(null, 10000)
    static someFunction () {
      return Math.random();
    }

    @MemoryCache([ 0 ], 10000) // Only cache based on the first arg
    static someOtherFunction (arg1, arg2) {
      return Math.random();
    }
  }

  describe('arguments as cache key not specified', () => {
    let someValue = null;

    it('first call should returns normally', () => {
      someValue = SomeTestClass.someFunction();
      return expect(someValue).to.not.be.null;
    });

    it('calling for second time should hit the cache', () => {
      clock.tick(5000);
      let someNewValue = SomeTestClass.someFunction();
      return expect(someNewValue).to.equal(someValue);
    });

    it('after cache timeout it should not hit the cache', () => {
      clock.tick(20000);
      let someNewValue = SomeTestClass.someFunction();
      return expect(someNewValue).to.not.equal(someValue);
    });
  });

  describe('arguments as cache key specified', () => {
    let someValue = null;

    it('first call should returns normally', () => {
      someValue = SomeTestClass.someOtherFunction(1234, 42);
      return expect(someValue).to.not.be.null;
    });

    describe('should hit cache only when arguments as key match', () => {
      it('same value', () => {
        let someNewValue = SomeTestClass.someOtherFunction(1234, 1337);
        return expect(someNewValue).to.be.equals(someValue);
      });

      it('different value', () => {
        let someNewValue = SomeTestClass.someOtherFunction(4321, 42);
        return expect(someNewValue).to.not.be.equals(someValue);
      });
    });
  });
});
