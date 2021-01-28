/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-bitwise */
const { assert } = require('chai');
const List = require('../List');

const plus = (v, w) => v + w;
const times = (v, w) => v * w;
const inc = (x) => x + 1;
const id = (x) => x;
const constant = id;

describe('List', () => {
    it('Method test: toList', () => {
        assert.deepEqual(List.empty.toList(), []);
        assert.deepEqual(List.empty.length(), 0);
        assert.deepEqual(new List([1, 2, 3]).toList(), [1, 2, 3]);
    });
    it('Method test: fromList', () => {
        assert.deepEqual(List.fromList([]).toList(), []);
        assert.deepEqual(List.fromList([1, 2, 3]).toList(), [1, 2, 3]);
        assert.deepEqual(List.fromList([1]).length(), 1);
        assert.deepEqual(List.fromList([1, 2]).length(), 2);
    });
    it('Method test: head', () => {
        assert.deepEqual(List.fromList([1, 2, 3]).head(), 1);
        assert.deepEqual(List.fromList([]).head(), undefined);
    });
    it('Method test: tail', () => {
        assert.deepEqual(List.fromList([1, 2, 3]).tail().toList(), [2, 3]);
        assert.deepEqual(List.fromList([]).tail().toList(), []);
    });
    it('Method test: get', () => {
        assert.deepEqual(List.fromList([1, 2, 3]).get(0), 1);
        assert.deepEqual(List.fromList([1, 2, 3]).get(1), 2);
        assert.deepEqual(List.fromList([1, 2, 3]).get(2), 3);
    });
    it('Method test: take', () => {
        assert.deepEqual(List.fromList([1, 2, 3, 4]).take(3).toList(), [1, 2, 3]);
    });
    it('Method test: drop', () => {
        assert.deepEqual(List.fromList([1, 2, 3, 4]).drop(1).toList(), [2, 3, 4]);
    });
    it('Method test: nil', () => {
        assert.deepEqual(List.empty.nil(), true);
        assert.deepEqual(List.fromList([1]).nil(), false);
        assert.deepEqual(List.fromList([1, 2]).nil(), false);
    });
    it('Method test: cons', () => {
        assert.deepEqual(List.fromList([2, 3]).cons(1).toList(), [1, 2, 3]);
        assert.deepEqual(List.empty.cons(1).toList(), [1]);
    });
    it('Method test: append', () => {
        assert.deepEqual(List.empty.append(List.empty).toList(), []);
        assert.deepEqual(List.empty.append(List.fromList([1, 2, 3])).toList(), [1, 2, 3]);
        assert.deepEqual(List.fromList([1, 2, 3]).append(List.empty).toList(), [1, 2, 3]);
        assert.deepEqual(List.fromList([1, 2, 3]).append(List.fromList([1, 2, 3])).toList(),
            [1, 2, 3, 1, 2, 3]);
    });
    it('Method test: slice', () => {
        assert.deepEqual(List.fromList([1, 2, 3]).slice(1).toList(), [2, 3]);
        assert.deepEqual(List.fromList([1, 2, 3]).slice(1, 2).toList(), [2]);
        assert.deepEqual(List.fromList([1, 2, 3]).slice().toList(), [1, 2, 3]);
    });
    it('Method test: map', () => {
        assert.deepEqual(List.fromList([1, 2, 3]).map((x) => x * x).toList(), [1, 4, 9]);
    });
    it('Method test: filter', () => {
        assert.deepEqual(List.fromList([1, 2, 3])
            .filter((x) => Boolean(x & 1)).toList(), [1, 3]);
        assert.deepEqual(List.fromList([1, 2, 3]).filter((x) => !(x & 1)).toList(), [2]);
    });
    it('Method test: reverse', () => {
        assert.deepEqual(List.fromList([1, 2, 3]).reverse().toList(), [3, 2, 1]);
        assert.deepEqual(List.fromList([]).reverse().toList(), []);
    });
    it('Method test: concat', () => {
        assert.deepEqual(List.fromList([List.fromList([1, 2, 3]),
            List.fromList([1, 2, 3])]).concat().toList(), [1, 2, 3, 1, 2, 3]);
        assert.deepEqual(List.empty.concat().toList(), []);
    });
    it('Method test: zipWith', () => {
        assert.deepEqual(List.fromList([1, 2, 3]).zipWith(times,
            List.fromList([3, 2, 1])).toList(), [3, 4, 3]);
    });
    it('Method test: foldr', () => {
        // assert.deepEqual(List.fromList([1, 2, 3]).foldr((x, z) => z.cons(x),
        //     List.empty).toList(), [1, 2, 3]);
        // assert.deepEqual(List.empty.foldr(() => _ | _, Math.E), Math.E);
    });
    it('Method test: foldl', () => {
        // assert.deepEqual(List.fromList([1, 2, 3]).foldl(plus, 0), 6);
        // assert.deepEqual(List.fromList([1, 2, 3]).foldl(inc, 0),
        //     List.fromList([1, 2, 3]).length());
    });
    it('Method test: scanr', () => {
        // assert.deepEqual(List.fromList([1, 2, 3]).scanr(plus, 0).toList(), [6, 5, 3, 0]);
        // assert.deepEqual(List.empty.scanr(times, 1).toList(), [1]);
    });
    it('Method test: scanl', () => {
        // assert.deepEqual(List.fromList([1, 2, 3]).scanl(plus, 0).toList(), [0, 1, 3, 6]);
        // assert.deepEqual(List.empty.scanl(times, 1).toList(), [1]);
    });
    it('Method test: elem', () => {
        assert.deepEqual(List.fromList([1, 2, 3]).elem(0), false);
        assert.deepEqual(List.fromList([1, 2, 3]).elem(2), true);
        assert.deepEqual(List.empty.elem(0), false);
    });
    it('Method test: elemIndex', () => {
        assert.deepEqual(List.fromList([1, 2, 3]).elemIndex(0), -1);
        assert.deepEqual(List.fromList([1, 2, 3]).elemIndex(2), 1);
        assert.deepEqual(List.empty.elemIndex(0), -1);
    });
    it('Method test: find / findIndex', () => {
        assert.deepEqual(List.fromList([1, 2, 3]).find((x) => !(x & 1)), 2);
        assert.deepEqual(List.fromList([1, 3]).find((x) => !(x & 1)), undefined);
        assert.deepEqual(List.empty.find((x) => !(x & 1)), undefined);
        assert.deepEqual(List.fromList([1, 2, 3]).findIndex((x) => !(x & 1)), 1);
        assert.deepEqual(List.fromList([1, 3]).find((x) => !(x & 1)), undefined);
        assert.deepEqual(List.empty.find((x) => !(x & 1)), undefined);
    });
    it('Method test: any', () => {
        assert.deepEqual(List.fromList([true, false]).any(id), true);
        assert.deepEqual(List.empty.any(id), false);
    });
    it('Method test: all', () => {
        assert.deepEqual(List.fromList([true, false]).all(id), false);
        assert.deepEqual(List.empty.all(id), true);
    });
    it('Method test: the', () => {
        assert.deepEqual(List.fromList([1, 2, 3]).the(), undefined);
        assert.deepEqual(List.fromList([1, 1, 1]).the(), 1);
        assert.deepEqual(List.empty.the(), undefined);
    });
});
describe('List generators', () => {
    it('Method test: empty', () => {
        assert.deepEqual(List.empty.toList(), []);
        assert.deepEqual(List.empty.append([1]).toList(), [1]);
        assert.deepEqual(new List().toList(), []);
    });
    it('Method test: repeat', () => {
        assert.deepEqual(List.repeat(1).take(10).toList(), [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
        assert.deepEqual(List.repeat(2).take(10).toList(), [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
        assert.deepEqual(List.repeat(3).take(10).toList(), [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
    });
    it('Method test: iterate', () => {
        assert.deepEqual(List.iterate(inc, 0).take(10).toList(),
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
    it('Method test: cycle', () => {
        assert.deepEqual(List.cycle(List.fromList([1, 2, 3])).take(10).toList(),
            [1, 2, 3, 1, 2, 3, 1, 2, 3, 1]);
    });
    it('Method test: replicate', () => {
        assert.deepEqual(List.replicate(10, 1).toList(), [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
        assert.deepEqual(List.replicate(10, 2).toList(), [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
        assert.deepEqual(List.replicate(10, 3).toList(), [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
        assert.deepEqual(List.replicate(0, undefined).toList(), List.empty.toList());
        assert.deepEqual(List.replicate(10, 1).toList(),
            List.iterate(id, 1).take(10).toList());
    });
    it('Generator test: All', () => {
        assert.deepEqual(List.ALL.take(10).toList(),
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
    it('Generator test: Prime', () => {
        // assert.deepEqual(List.PRIME.take(8).toList(),
        //     [2, 3, 5, 7, 11, 13, 17, 19]);
    });
    it('Generator test: Fibonacci', () => {
        assert.deepEqual(List.FIB.take(13).toList(),
            [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]);
    });
});
describe('Temporary tests', () => {
    it('Temporary tests', () => {
        assert.deepEqual(List.ALL.take(10).toList(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        assert.deepEqual(List.ALL.filter((a) => a > 5).algorithms[1].toString(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
});
