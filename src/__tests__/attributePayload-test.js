
import {create, diff} from '../attributePayload';

// most of these test cases come from ReactNative

describe('attributePayload', () => {
  describe('create', () => {
    it('should return null when no valid attributes passed', () => {
      expect(create(
        {c: 'a', d: 'b'},
        {a: true, b: true}
      )).toEqual(null);
    });

    it('should filter out invalid attributes', () => {
      expect(create(
        {a: 'a', b: 'b', c: 'nope'},
        {a: true, b: true}
      )).toEqual({a: 'a', b: 'b'});
    });
  });

  describe('update', () => {
    it('should return null for identical props', () => {
      expect(diff(
        {a: 1, b: 2},
        {a: 1, b: 2},
        {a: true, b: true}
      )).toEqual(null);
    });

    it('should work with simple example', () => {
      expect(diff(
        {a: 1, c: 3},
        {b: 2, c: 3},
        {a: true, b: true}
      )).toEqual({a: null, b: 2});
    });

    it('should work with another simple example', () => {
      expect(diff(
        {a: 1, c: 3},
        {a: '4', b: 2, c: 3},
        {a: true, b: true}
      )).toEqual({a: '4', b: 2});
    });

    it('should remove fields', () => {
      expect(diff(
        {a: 1},
        {},
        {a: true}
      )).toEqual({a: null});
    });

    it('TODO: figure out function diffing when this is implemented', () => {
      const fn1 = () => {};
      const fn2 = () => {};
      expect(diff(
        {a: fn1},
        {a: fn2},
        {a: true}
      )).toEqual({a: fn2});
    });
  });
});

