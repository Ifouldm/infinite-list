/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-bitwise */
const { assert } = require('chai');
const List = require('../List');

const odd = (x) => x % 2 !== 0;
const even = (x) => x % 2 === 0;
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
        assert.deepEqual(List.PI.toList(), undefined);
    });
    it('Method test: fromList', () => {
        assert.deepEqual(List.fromList([]).toList(), []);
        assert.deepEqual(List.fromList([1, 2, 3]).toList(), [1, 2, 3]);
        assert.deepEqual(List.fromList([1]).length(), 1);
        assert.deepEqual(List.fromList([1, 2]).length(), 2);
        assert.deepEqual(List.fromList(List.PI).length(), Infinity);
        assert.deepEqual(List.fromList(List.PI).take(5).toList(), [3, 1, 4, 1, 5]);
    });
    it('Method test: head', () => {
        assert.deepEqual(List.fromList([1, 2, 3]).head(), 1);
        assert.deepEqual(List.fromList([]).head(), undefined);
        assert.deepEqual(List.PI.head(), 3);
    });
    it('Method test: tail', () => {
        assert.deepEqual(List.fromList([1, 2, 3]).tail().toList(), [2, 3]);
        assert.deepEqual(List.fromList([]).tail().toList(), []);
        assert.deepEqual(List.PI.tail().take(5).toList(), [1, 4, 1, 5, 9]);
    });
    it('Method test: init', () => {
        assert.deepEqual(List.fromList([]).init().toList(), []);
        assert.deepEqual(List.fromList([1, 2, 3]).init().toList(), [1, 2]);
        assert.deepEqual(List.fromList([5, 6, 7]).init().toList(), [5, 6]);
        assert.deepEqual(List.PI.init().take(5).toList(), [3, 1, 4, 1, 5]);
    });
    it('Method test: last', () => {
        assert.deepEqual(List.fromList([]).last(), undefined);
        assert.deepEqual(List.fromList([1, 2, 3]).last(), 3);
        assert.deepEqual(List.fromList([5, 6, 7]).last(), 7);
        assert.deepEqual(List.PI.last(), undefined);
    });
    it('Method test: get', () => {
        assert.deepEqual(List.fromList([1, 2, 3]).get(0), 1);
        assert.deepEqual(List.fromList([1, 2, 3]).get(1), 2);
        assert.deepEqual(List.fromList([1, 2, 3]).get(2), 3);
        assert.deepEqual(List.fromList([1, 2, 3]).get(6), undefined);
        assert.deepEqual(List.PI.get(3), 1);
    });
    it('Method test: take', () => {
        assert.deepEqual(List.fromList([1, 2, 3, 4]).take(3).toList(), [1, 2, 3]);
        assert.deepEqual(List.fromList([1, 2, 3, 4]).take(5).toList(), [1, 2, 3, 4]);
        assert.deepEqual(List.fromList([1, 2, 3, 4]).take(-2).toList(), []);
        assert.deepEqual(List.empty.take(5).toList(), []);
    });
    it('Method test: drop', () => {
        assert.deepEqual(List.fromList([1, 2, 3, 4]).drop(1).toList(), [2, 3, 4]);
        assert.deepEqual(List.fromList([1, 2, 3, 4]).drop(2).toList(), [3, 4]);
        assert.deepEqual(List.fromList([1, 2, 3, 4]).drop(6).toList(), []);
    });
    it('Method test: nil', () => {
        assert.deepEqual(List.empty.nil(), true);
        assert.deepEqual(List.fromList([1]).nil(), false);
        assert.deepEqual(List.fromList([1, 2]).nil(), false);
        assert.deepEqual(List.PI.nil(), false);
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
        assert.deepEqual(List.PI.append(List.fromList([5, 6, 7])).take(3).toList(), [3, 1, 4]);
    });
    it('Method test: slice', () => {
        assert.deepEqual(List.fromList([1, 2, 3]).slice(1).toList(), [2, 3]);
        assert.deepEqual(List.fromList([1, 2, 3]).slice(1, 2).toList(), [2]);
        assert.deepEqual(List.fromList([1, 2, 3]).slice().toList(), [1, 2, 3]);
        assert.deepEqual(List.PI.slice(4).take(4).toList(), [5, 9, 2, 6]);
        assert.deepEqual(List.PI.slice(1, 4).toList(), [1, 4, 1]);
    });
    it('Method test: map', () => {
        assert.deepEqual(List.fromList([1, 2, 3]).map((x) => x * x).toList(), [1, 4, 9]);
        assert.deepEqual(List.fromList([11, 22, 4]).map(inc).toList(), [12, 23, 5]);
    });
    it('Method test: filter', () => {
        assert.deepEqual(List.fromList([1, 2, 3])
            .filter((x) => Boolean(x & 1)).toList(), [1, 3]);
        assert.deepEqual(List.fromList([1, 2, 3]).filter((x) => !(x & 1)).toList(), [2]);
        assert.deepEqual(List.iterate((x) => x + 1, 0)
            .filter(odd).take(8).toList(), [1, 3, 5, 7, 9, 11, 13, 15]);
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
    it('Method test: concatMap', () => {
        assert.deepEqual(List.fromList([List.fromList([1, 2, 3]),
            List.fromList([1, 2, 3])]).concatMap(inc).toList(), [2, 3, 4, 2, 3, 4]);
        assert.deepEqual(List.fromList([1, 2, 3])
            .concatMap((n) => List.replicate(n, n)).toList(), [1, 2, 2, 3, 3, 3]);
        assert.deepEqual(List.fromList([0, 1, 2, 3])
            .concatMap(List.repeat).take(5).toList(), [0, 0, 0, 0, 0]);
    });
    it('Method test: zipWith', () => {
        assert.deepEqual(List.fromList([1, 2, 3]).zipWith(times,
            List.fromList([3, 2, 1])).toList(), [3, 4, 3]);
    });
    it('Method test: foldr', () => {
        assert.deepEqual(List.fromList([1, 2, 3]).foldr((x, z) => z.cons(x),
            List.empty).toList(), [1, 2, 3]);
        assert.deepEqual(List.empty.foldr(() => _ | _, Math.E), Math.E);
    });
    it('Method test: foldl', () => {
        assert.deepEqual(List.fromList([1, 2, 3]).foldl(plus, 0), 6);
        assert.deepEqual(List.fromList([1, 2, 3]).foldl(inc, 0),
            List.fromList([1, 2, 3]).length());
    });
    it('Method test: scanr', () => {
        assert.deepEqual(List.fromList([1, 2, 3]).scanr(plus, 0).toList(), [6, 5, 3, 0]);
        assert.deepEqual(List.empty.scanr(times, 1).toList(), [1]);
    });
    it('Method test: scanl', () => {
        assert.deepEqual(List.fromList([1, 2, 3]).scanl(plus, 0).toList(), [0, 1, 3, 6]);
        assert.deepEqual(List.empty.scanl(times, 1).toList(), [1]);
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
        assert.deepEqual(List.cycle([1, 2, 3]).take(12).toList(),
            [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3]);
    });

    it('Method test: replicate', () => {
        assert.deepEqual(List.replicate(10, 1).toList(), [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
        assert.deepEqual(List.replicate(10, 2).toList(), [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
        assert.deepEqual(List.replicate(10, 3).toList(), [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
        assert.deepEqual(List.replicate(0, undefined).toList(), List.empty.toList());
        assert.deepEqual(List.replicate(10, 1).toList(),
            List.iterate(id, 1).take(10).toList());
    });

    it('Generator test: Prime', () => {
        assert.deepEqual(List.PRIME.take(8).toList(),
            [2, 3, 5, 7, 11, 13, 17, 19]);
    });

    it('Generator test: Fibonacci', () => {
        assert.deepEqual(List.FIB.take(13).toList(),
            [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]);
    });

    it('Generator test: Pi', () => {
        assert.deepEqual(List.PI.take(15).toList(),
            [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9]);
    });
});

describe('Codewars tests', () => {
    it('Take / drop tests', () => {
        const l = List.fromList([1, 2, 3, 4]);
        assert.deepEqual(l.take(0).toList(), []);
        assert.deepEqual(l.take(3).toList(), [1, 2, 3]);
        assert.deepEqual(l.take(-1).toList(), []);
        assert.deepEqual(l.take(1e10).toList(), [1, 2, 3, 4]);
        assert.deepEqual(l.drop(0).toList(), [1, 2, 3, 4]);
        assert.deepEqual(l.drop(3).toList(), [4]);
        assert.deepEqual(l.drop(-1).toList(), [1, 2, 3, 4]);
    });

    it('Concat tests', () => {
        const l = List.fromList([1, 2, 3]);
        const m = List.fromList([l, l]);
        const n = List.fromList([List.fromList([1, 1]), List.repeat(2)]);

        assert.deepEqual(l.concat().toList(), [1, 2, 3]);
        assert.deepEqual(m.concat().toList(), [1, 2, 3, 1, 2, 3]);
        assert.deepEqual(n.concat().take(3).toList(), [1, 1, 2]);
        assert.deepEqual(List.repeat([1, 2, 3]).concat().take(4).toList(), [1, 2, 3, 1]);
    });

    it('More Concat tests', () => {
        assert.deepEqual(List.fromList([List.fromList([1, 2, 3])]).concat().toList(), [1, 2, 3]);
        assert.deepEqual(List.fromList([[1, 2, 3], [1, 2, 3]])
            .concat().toList(), [1, 2, 3, 1, 2, 3]);
        assert.deepEqual(List.fromList([List.fromList([1, 1]), List.repeat(2)])
            .concat().take(3).toList(), [1, 1, 2]);
        assert.deepEqual(List.repeat(List.repeat(1)).concat().take(3).toList(), [1, 1, 1]);
        assert.deepEqual(List.iterate(inc, 3).map(List.repeat).concat().take(3)
            .toList(), [3, 3, 3]);
        assert.deepEqual(List.repeat([1, 2, 3]).concat().take(4).toList(), [1, 2, 3, 1]);
    });

    it('Empty list tests', () => {
        l = List.empty;

        assert.deepEqual(l.concat().toList(), []);
        assert.deepEqual(l.nil(), true);
        assert.deepEqual(l.any((x) => x === 1), false);
        assert.deepEqual(l.all(Boolean), true);
        assert.deepEqual(l.elem(0), false);
        assert.deepEqual(l.elemIndex(0), -1);
        assert.deepEqual(l.find(Boolean), undefined);
        assert.deepEqual(l.findIndex(Boolean), -1);
    });

    it('zipWith tests', () => {
        const l0 = List.iterate(inc, 0);
        const l1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const l2 = l0.take(10);

        assert.deepEqual(l1 === l2, false);
        assert.deepEqual(l0.zipWith(times, l1).take(10).toList(),
            [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]);
    });

    it('iterate tests', () => {
        l = List.iterate(inc, 0).take(5);

        l.the();
        assert.deepEqual(List.iterate(inc, 0).take(1001).length(), 1001);
        assert.deepEqual(List.iterate(inc, 0).take(1001).reverse().length(), 1001);
        assert.deepEqual(List.iterate(inc, 0).findIndex((x) => x > 1000), 1001);
    });

    it('[1,2,1,3,4] tests', () => {
        l = List.fromList([1, 2, 1, 3, 4]);

        assert.deepEqual(l.scanl(plus, 0).toList(), [0, 1, 3, 4, 7, 11]);
        assert.deepEqual(l.reverse().scanr(plus, 0).toList(), [11, 7, 4, 3, 1, 0]);
        assert.deepEqual(l.last(), 4);
        assert.deepEqual(l.foldr(plus, 0), 11);
        assert.deepEqual(l.map(inc).toList(), [2, 3, 2, 4, 5]);
    });

    it('repeat tests', () => {
        assert.deepEqual(List.repeat(List.repeat(1)).concat().take(3).toList(), [1, 1, 1]);
        assert.deepEqual(List.iterate(inc, 3).take(5).toList(), [3, 4, 5, 6, 7]);
        assert.deepEqual(List.iterate(inc, 3).map(inc).take(3).toList(), [4, 5, 6]);
        assert.deepEqual(List.iterate(inc, 3).map(List.repeat).concat().take(3)
            .toList(), [3, 3, 3]);
        assert.deepEqual(List.repeat([1, 2, 3]).concat().take(4).toList(), [1, 2, 3, 1]);
    });

    it('zipWith tests', () => {
        const l0 = List.iterate(inc, 0);
        const l1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const l2 = l0.take(10);
        assert.deepEqual(l0.zipWith(times, l1).toList(), [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]);
        assert.deepEqual(List.repeat([1, 2, 3]).concat().take(4).toList(), [1, 2, 3, 1]);
    });

    it('the tests', () => {
        assert.deepEqual(List.fromList([]).the(), undefined);
        assert.deepEqual(List.fromList([0]).the(), 0);
        assert.deepEqual(List.fromList([1]).the(), 1);
        assert.deepEqual(List.fromList([0, 0, 0]).the(), 0);
        assert.deepEqual(List.fromList([1, 1, 1]).the(), 1);
        assert.deepEqual(List.fromList([0, 1, 2]).the(), undefined);
        assert.deepEqual(List.replicate(10, 1).append(List.repeat(2)).the(), undefined);
    });

    it('[0,1,...]', () => {
        const l = List.iterate(inc, 0);

        assert.deepEqual(l.head(), 0);
        assert.deepEqual(l.tail().head(), 1);
        assert.deepEqual(l.tail().take(3).toList(), [1, 2, 3]);
        assert.deepEqual(l.take(10).toList(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        assert.deepEqual(l.take(10).toList(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        assert.deepEqual(l.nil(), false);
        assert.deepEqual(l.foldr(constant), 0);
        assert.deepEqual(l.foldr(constant, undefined), undefined);
        assert.deepEqual(l.foldr(constant(17)), 17);
        assert.deepEqual(l.scanl(plus, 0).take(10).toList(), [0, 0, 1, 3, 6, 10, 15, 21, 28, 36]);
        assert.deepEqual(l.drop(10).take(10).toList(), [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
        assert.deepEqual(l.any((x) => x === 3), true);
    });

    it('PI test', () => {
        assert.deepEqual(List.PI.get(12), 9);
    });

    it('random tests', () => {
        assert.deepEqual(List.repeat(2)
            .zipWith(times,
                List.cycle([1, 2, 3]))
            .map((x) => x - 1)
            .take(3)
            .reverse()
            .toList(),
        [5, 3, 1]);
        assert.deepEqual(List.repeat(2)
            .zipWith(times,
                List.cycle([1, 2, 3]))
            .map((x) => x - 1)
            .take(6)
            .reverse()
            .toList(),
        [5, 3, 1, 5, 3, 1]);
        assert.deepEqual(List.repeat([1, 2, 3])
            .concat()
            .take(4)
            .toList(),
        [1, 2, 3, 1]);
    });
    it('Another Random Test', () => {
        const l = List.cycle([1, 2, 3]);

        assert.deepEqual(l.head(), 1);
        assert.deepEqual(l.tail().take(6).toList(), [2, 3, 1, 2, 3, 1]);
        assert.deepEqual(l.filter(odd).take(6).toList(),
            [1, 3, 1, 3, 1, 3]);
        assert.deepEqual(l.map((x) => x * x).take(5).toList(), [1, 4, 9, 1, 4]);
        assert.deepEqual(l.map((x) => x * x).tail().findIndex((x) => x === 1), 2);
    });
});
