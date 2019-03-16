import {create, diff} from '../attributePayload';

// most of these test cases come from ReactNative

describe('attributePayload', () => {
  describe('create', () => {
    it('should return null when no valid attributes passed', () => {
      expect(create({c: 'a', d: 'b'}, {a: true, b: true})).toEqual(null);
    });

    it('should filter out invalid attributes', () => {
      expect(create({a: 'a', b: 'b', c: 'nope'}, {a: true, b: true})).toEqual({
        a: 'a',
        b: 'b',
      });
    });

    it('should return non-primitive valid attributes', () => {
      expect(
        create(
          {pins: [1, 2, 3], values: [0, 255, 0]},
          {pins: true, values: true},
        ),
      ).toEqual({pins: [1, 2, 3], values: [0, 255, 0]});
    });
  });

  describe('update', () => {
    it('should return null for identical props', () => {
      expect(diff({a: 1, b: 2}, {a: 1, b: 2}, {a: true, b: true})).toEqual(
        null,
      );
    });

    it('should work with simple example', () => {
      expect(diff({a: 1, c: 3}, {b: 2, c: 3}, {a: true, b: true})).toEqual({
        a: null,
        b: 2,
      });
    });

    it('should work with another simple example', () => {
      expect(
        diff({a: 1, c: 3}, {a: '4', b: 2, c: 3}, {a: true, b: true}),
      ).toEqual({a: '4', b: 2});
    });

    it('should remove fields', () => {
      expect(diff({a: 1}, {}, {a: true})).toEqual({a: null});
    });

    it('should diff non-primitive valid attributes', () => {
      expect(
        diff(
          {pins: [1, 2, 3], values: [0, 255, 0]},
          {pins: [1, 2, 3], values: [255, 125, 125]},
          {pins: true, values: true},
        ),
      ).toEqual({pins: [1, 2, 3], values: [255, 125, 125]});
    });

    it('should diff functions', () => {
      const fn1 = () => {};
      const fn2 = () => {};
      expect(diff({a: fn1}, {a: fn2}, {a: true})).toEqual({a: fn2});
    });
  });
});
