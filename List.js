/* eslint-disable no-restricted-syntax */
/**
 * Represents a List of finite or infinite length
 */
class List {
    /**
    * Create a List
    * @param {*} list - An existing list or a function to generate an infinite list
    */
    constructor(...args) {
        this.list = [];
        this.isInfinite = false;
        if (Array.isArray(args[0])) {
            [this.list] = args;
        }
        if (typeof args[0] === 'function') {
            this.isInfinite = true;
            [this.infFunction] = args;
        }
    }

    /**
     * Generate a new empty List
     * @return {List} An empty List
     */
    static get empty() {
        return new List();
    }

    /**
     * Generate an infinite list of all prime numbers starting at 0 and increasing
     * @return {List} An infinite list of all prime numbers
     */
    static get PRIME() {
        function* primeFunction() {
            function isPrime(num) {
                for (let i = 2, s = Math.sqrt(num); i <= s; i += 1) if (num % i === 0) return false;
                return num > 1;
            }
            for (let i = 0; ; i += 1) {
                if (isPrime(i)) {
                    yield i;
                }
            }
        }
        return new List(primeFunction);
    }

    /**
     * Generate an infinite list of all fibonacci numbers starting at 0 and increasing
     * @return {List} An infinite list of all Fibonacci numbers
     */
    static get FIB() {
        function* fibFunction() {
            yield 0;
            yield 1;
            let prev = 0;
            let current = 1;
            while (true) {
                const next = current + prev;
                yield next;
                prev = current;
                current = next;
            }
        }
        return new List(fibFunction);
    }

    /**
     * Generate an infinite list containing the digits of PI
     * @return {List} An infinite list of the digits of PI
     */
    static get PI() {
        function* piFunction() {
            let q = 1n;
            let r = 180n;
            let t = 60n;
            for (let i = 2n; ; i += 1n) {
                const y = (q * (27n * i - 12n) + 5n * r) / (5n * t);
                const u = 3n * (3n * i + 1n) * (3n * i + 2n);
                r = 10n * u * (q * (5n * i - 2n) + r - y * t);
                q = 10n * q * i * (2n * i - 1n);
                t *= u;
                yield Number(y);
            }
        }
        return new List(piFunction);
    }

    /**
     * Generate a @List from an existing @List or @Array
     * @param {*} list Incoming List
     * @return {List} New List containing list
     */
    static fromList(list) {
        if (list.isInfinite) {
            return new List(list.infFunction);
        }
        return new List(list);
    }

    /**
     * Generate an infinite list of successive applications of fn to x
     * @param {function} fn A function to apply to each value
     * @param {any} x Value to be used in function
     * @return {List} An infinite list of function fn applied to x
     */
    static iterate(fn, x) {
        function* iterateFunction() {
            let curr = x;
            while (true) {
                yield curr;
                curr = fn(curr);
            }
        }

        return new List(iterateFunction);
    }

    /**
     * Generate an infinite list, every element of which is val
     * @param {*} val a value to populate the list with
     * @return {List} An infinite list every element of which is val
     */
    static repeat(val) {
        function* repeatFunction() {
            while (true) {
                yield val;
            }
        }
        return new List(repeatFunction);
    }

    /**
     * Generate a finite list of length n, every element of which is x
     * @param {Number} n Length of the list
     * @param {*} x the value to populate the list with
     * @return {List} A finite list of length n, every element of which is x
     */
    static replicate(n, x) {
        return new List(Array(n).fill(x));
    }

    /**
     * Generate an infinite list of repetitions of xs ( equals xs if xs is infinite )
     * @param {List} list List to be repeated infinitely
     * @return {List} An infinite list containing list repeated infinitly
     */
    static cycle(list) {
        if (list.isInfinite) {
            return list;
        }
        function* cycleFunction() {
            for (let i = 0; ; i += 1) {
                const cycleList = Array.isArray(list) ? list : list.list;
                const index = i % cycleList.length;
                yield cycleList[index];
            }
        }
        return new List(cycleFunction);
    }

    /**
     * Retrieve the Head of the list
     * @return the first element of list, or undefined for empty list
     */
    head() {
        return this.get(0);
    }

    /**
     * Retreieve the Tail of the list
     * @return list without its first element, or an empty list for empty list
     */
    tail() {
        return this.slice(1);
    }

    /**
     * Retrieve the element of list at index i
     * @param {Number} index The index to look up
     * @return {*} The element at index i
     */
    get(index) {
        if (this.isInfinite) {
            const generator = this.infFunction();
            for (let i = 0; i < index; i += 1) {
                generator.next();
            }
            return generator.next().value;
        }
        return this.list[index];
    }

    /**
     * List converted to an Array
     * @return {Array} an Array
     */
    toList() {
        if (this.isInfinite) {
            return undefined;
        }
        return Array.from(this.list);
    }

    /**
     * the first (at most) n elements of list ( n may be negative or greater than list.length() )
     * @param {Number} n The number of elements to retrieve
     * @return {List} A new List containing the first n elements of the list
     */
    take(n) {
        if (n < 0) {
            return List.empty;
        }
        if (n > this.length()) {
            return new List(this.list);
        }
        if (this.isInfinite) {
            const generator = this.infFunction();
            const genList = [];
            for (let i = 0; i < n; i += 1) {
                genList.push(generator.next().value);
            }
            return new List(genList);
        }
        return new List(this.list.slice(0, n));
    }

    /**
     * list without its first ( at most ) n elements ( n may be negative
        or greater than list.length() )
     * @param {Number} quantity The number of elements to drop
     * @return {List} A new List containing all elements after the nth element
     */
    drop(quantity) {
        if (this.isInfinite) {
            const generator = this.infFunction();
            const genFunc = function* generatorFunction() {
                for (let i = 0; ; i += 1) {
                    const next = generator.next();
                    if (i >= quantity) {
                        yield next.value;
                    }
                }
            };
            return new List(genFunc);
        }
        if (quantity > this.length()) {
            return List.empty;
        }
        if (quantity < 0) {
            return new List(this.list);
        }
        return new List(this.list.slice(quantity));
    }

    /**
     * the length of list
     * @return {Number} The length of the list
     */
    length() {
        return this.isInfinite ? Infinity : this.list.length;
    }

    /**
     * True if the list is empty
     * @return {Boolean} True if the list if empty
     */
    nil() {
        return this.length() === 0;
    }

    /**
     * element prepended to list
     * @param {*} element The element to prepend
     * @return The list including the prepended value
     */
    cons(element) {
        if (this.isInfinite) {
            if (!element) {
                return new List(this.infFunction);
            }
        }
        this.list.unshift(element);
        return new List(this.list);
    }

    /**
     * list without its last element, or an empty list for empty list
        ( equals list if list is infinite )
     */
    init() {
        if (this.isInfinite) {
            return new List(this.infFunction);
        }
        return new List(this.list.slice(0, this.list.length - 1));
    }

    /**
     * the last element of list, or undefined for empty list
     * @return The last element of the list
     */
    last() {
        if (this.isInfinite || this.nil()) {
            return undefined;
        }
        return this.list[this.list.length - 1];
    }

    /**
     * Append newList elements list
     * @param {List} newList The list of elements to append
     * @return {List} The list including the appended elements
     */
    append(newList) {
        if (this.isInfinite) {
            return this;
        }
        if (newList instanceof List) {
            if (!newList.isInfinite) {
                this.list.push(...newList.list);
                return this;
            }
            const generator = newList.infFunction();
            const genFunc = function* generatorFunc() {
                for (const val of this.list) {
                    console.log(val);
                    yield val;
                }
                const next = generator.next();
                yield next.value;
            };
            return new List(genFunc);
        }
        if (Array.isArray(newList)) {
            this.list.push(...newList);
        } else if (newList.nil()) {
            return this;
        } else {
            const elements = newList.toList();
            this.list.push(...elements);
        }
        return this;
    }

    /**
     * list from index i (inclusive) to index j (exclusive) ( both arguments
        are optional; result is undefined for arguments not in list )
     * @param {Number} start Index at which to start slice
     * @param {Number} end Index at which to end slice (exclusive)
     */
    slice(start = 0, end = this.length()) {
        if (this.isInfinite) {
            const generator = this.infFunction();
            if (end !== Infinity) {
                const sliceList = [];
                for (let i = 0; i < start + end - 1; i += 1) {
                    const next = generator.next();
                    if (i >= start) {
                        sliceList.push(next.value);
                    }
                }
                return new List(sliceList);
            }
            const sliceGen = function* sliceFunction() {
                for (let i = 0; ; i += 1) {
                    const next = generator.next();
                    if (i >= start && i < end) {
                        yield next.value;
                    }
                }
            };
            return new List(sliceGen);
        }
        return new List(this.list.slice(start, end));
    }

    /**
     * Reverses the list in place
     * @return {List} The List after reversal
     */
    reverse() {
        return new List([...this.list].reverse());
    }

    /**
     * List transformed by function
     * @param {Function} mapfunction The function to be applied to each element
     * @return A new list containing the mapped values
     */
    map(mapfunction) {
        if (this.isInfinite) {
            const generator = this.infFunction();
            const genFunc = function* generatorFunction() {
                while (true) {
                    const value = generator.next();
                    yield mapfunction(value.value);
                }
            };
            return new List(genFunc);
        }
        const newList = [];
        this.list.forEach((element) => newList.push(mapfunction(element)));
        return new List(newList);
    }

    /**
     * List only the elements for which fn holds true
     * @param {Function} filterFunction The function to be applied to each element (
            returns true for elements to be included)
     * @return {List} A new List of values after filter
     */
    filter(filterFunction) {
        if (this.isInfinite) {
            const generator = this.infFunction();
            const filterFunc = function* filterGen() {
            // eslint-disable-next-line no-restricted-syntax
                for (const val of generator) {
                    if (filterFunction(val)) {
                        yield val;
                    }
                }
            };
            return new List(filterFunc);
        }
        const newList = [];
        this.list.forEach((element) => {
            if (filterFunction(element)) {
                newList.push(element);
            }
        });
        return new List(newList);
    }

    /**
     * True if fn holds for any element of list, false otherwise (
        possibly diverges for infinite list ) ( .some() in JavaScript )
     * @param {Function} anyFunction A function to be applied to each element
     * @return {Boolean} True if any element evaluates True
     */
    any(anyFunction) {
        for (let i = 0; i < 10000; i += 1) {
            const element = this.get(i);
            if (anyFunction(element)) {
                return true;
            }
        }
        return false;
    }

    /**
     * True if fn holds for all element of list, false otherwise (
        possibly diverges for infinite list ) ( .every() in JavaScript )
     * @param {Function} allFunction A function to be applied to each element
     * @return {Boolean} True if all elements evalute True
     */
    all(allFunction) {
        for (let i = 0; i < this.length(); i += 1) {
            const element = this.list[i];
            if (!allFunction(element)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Find the first element in the list for which the function evaluates True
     * @param {Function} findFunction A function to be applied to each element
     * @return {*} The first element which evaluates True
     */
    find(findFunction) {
        for (let i = 0; i < this.length(); i += 1) {
            const element = this.list[i];
            if (findFunction(element)) {
                return element;
            }
        }
        return undefined;
    }

    /**
     * Find the index of the first element in the list for which the function evaluates True
     * @param {Function} findFunction A function to be applied to each element
     * @return {Number} The index of the first element which evaluates True
     */
    findIndex(findFunction) {
        let generator;
        if (this.isInfinite) {
            generator = this.infFunction();
        }
        for (let i = 0; i < this.length(); i += 1) {
            let element;
            if (this.isInfinite) {
                element = generator.next().value;
            } else {
                element = this.get(i);
            }
            if (findFunction(element)) {
                return i;
            }
            if (i > 1000000) break;
        }
        return -1;
    }

    /**
     * list flattened; list must be a list of lists (
        behaves differently than .concat() in JavaScript ! )
     * @return {List} A flattened List
     */
    concat() {
        if (this.isInfinite) {
            const generator = this.infFunction();
            const concatFunc = function* concatFunction() {
                while (true) {
                    const next = generator.next();
                    const innerList = next.value;
                    if (innerList instanceof List) {
                        if (innerList.isInfinite) {
                            const gen = innerList.infFunction();
                            for (const element of gen) {
                                yield element;
                            }
                        } else {
                            for (let i = 0; i < innerList.length(); i += 1) {
                                const element = innerList.list[i];
                                yield element;
                            }
                        }
                    } else if (Array.isArray(innerList)) {
                        for (const element of innerList) {
                            yield element;
                        }
                    }
                }
            };
            return new List(concatFunc);
        }
        const flattenedList = [];
        for (let i = 0; i < this.length(); i += 1) {
            // If this is a list of lists
            if (this.list[i] instanceof List) {
                const internalList = this.list[i];
                // While the list is not infinite add its values to running list
                if (!internalList.isInfinite) {
                    for (const val of internalList.list) {
                        flattenedList.push(val);
                    }
                } else {
                    // create a generator of running list followed by infinite list
                    const concatGenerator = function* genFunc() {
                        for (let j = 0; j < flattenedList.length; j += 1) {
                            const element = flattenedList[j];
                            yield element;
                        }
                        const newGen = internalList.infFunction();
                        let done = false;
                        while (!done) {
                            const next = newGen.next();
                            done = next.done;
                            yield next.value;
                        }
                    };
                    return new List(concatGenerator);
                }
            } else if (Array.isArray(this.list[i])) {
                for (const value of this.list[i]) flattenedList.push(value);
            } else {
                flattenedList.push(this.list[i]);
            }
        }
        return new List(flattenedList);
    }

    /**
     * Generates a new List that is flattened and mapped using the provided function
     * @param {Function} fn Function to be applied to all elements of flattened list
     */
    concatMap(fn) {
        return this.concat().map(fn).concat();
    }

    /**
     * right-associative reduction of list to a single value
     * ( [x1,x2,..,xn].foldr(fn,z) = fn( x1, fn( x2, .. fn( xn, z ) ) ) )
     * ( foldr should only recursively evaluate necessary fn arguments,
     * as to return a valid value from a nullary or unary fn even if list is infinite )
     * ( not quite .reduceRight() in JavaScript )
     * @param {Function} fn Reduction function
     * @param {*} x An accumulative value
     * @return {*} A value after reduction
     */
    foldr(fn, x) {
        if (this.isInfinite) {
            // check if function returns a constant value ???
            if (fn.length < 2) {
                if (arguments.length === 1) return fn(x || 0);
                return x;
            }
            return (typeof fn !== 'function') ? fn : fn(x);
        }
        let accumulator = x;
        for (let i = 0; i < this.length(); i += 1) {
            const index = this.length() - i - 1;
            accumulator = fn(this.get(index), accumulator);
        }
        return accumulator;
    }

    /**
     * left-associative reduction of list to a single value
     * ( [x1,x2,..,xn].foldl(fn,z) = fn( .. fn( fn( z, x1 ), x2 ) .., xn ) )
     * ( diverges for infinite list )
     * ( .reduce() in JavaScript )
     * @param {Function} fn Reduction function
     * @param {*} x An accumulative value
     * @return {*} A value after reduction
     */
    foldl(fn, x) {
        if (this.isInfinite) {
            return undefined;
        }
        let accumulator = x;
        for (let i = 0; i < this.length(); i += 1) {
            accumulator = fn(accumulator, this.get(i));
        }
        return accumulator;
    }

    /**
     * right-associative incremental reduction of list to a list
     * ( [x1,x2,..,xn].scanr(fn,z) = [ fn( x1, .. ), .., fn( x(n-1), fn( xn, z ) ),
     * fn( xn, z ), z ] ) ( scanr should only recursively evaluate necessary fn arguments,
     * as to return a valid value from a nullary or unary fn even if list is infinite.
     * earlier versions of the kata did not have this requirement,
     * so this is tested for Bonus Points only )
     * @param {Function} fn Reduction function
     * @param {*} x A value after reduction
     */
    scanr(fn, x) {
        if (this.isInfinite) {
            return 'err';
        }
        let accumulator = x;
        const listSteps = [x];
        for (let i = 0; i < this.length(); i += 1) {
            const index = this.length() - i - 1;
            accumulator = fn(this.get(index), accumulator);
            listSteps.unshift(accumulator);
        }
        return new List(listSteps);
    }

    /**
     * left-associative incremental reduction of list to a list
     * ( [x1,x2,..,xn].scanl(fn,z) = [ z, fn( z, x1 ), fn( fn( z, x1 ), x2 ),
     * .., fn( .., xn ) ] )
     * @param {Function} fn Reduction function
     * @param {*} x A value after reduction
     */
    scanl(fn, x) {
        if (this.isInfinite) {
            let accumulator = x;
            const generator = this.infFunction();
            const genFunc = function* generatorFunction() {
                while (true) {
                    yield accumulator;
                    const next = generator.next();
                    accumulator = fn(accumulator, next.value);
                }
            };
            return new List(genFunc);
        }
        let accumulator = x;
        const listSteps = [accumulator];
        for (let i = 0; i < this.length(); i += 1) {
            accumulator = fn(accumulator, this.get(i));
            listSteps.push(accumulator);
        }
        return new List(listSteps);
    }

    /**
     * true if list contains element, false otherwise ( .includes() in JavaScript )
     * @param {*} element Element to check inclusivity
     * @return {Boolean} True if list contains element
     */
    elem(element) {
        for (let i = 0; i < this.length(); i += 1) {
            if (element === this.list[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * index of element in list, or -1 if list does not contain element ( .indexOf() in JavaScript )
     * @param {*} element Element to find index of
     * @return {Number} Index of element or -1 if not found
     */
    elemIndex(element) {
        for (let i = 0; i < this.length(); i += 1) {
            if (element === this.list[i]) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Any element of list if all elements of list are equal, undefined otherwise
     * @return {*} An element of the List or undefined
     */
    the() {
        if (this.isInfinite) {
            return undefined;
        }
        if (!this.nil()) {
            const firstElement = this.list[0];
            for (let i = 1; i < this.length(); i += 1) {
                if (firstElement !== this.list[i]) {
                    return undefined;
                }
            }
            return firstElement;
        }
        return undefined;
    }

    /**
     * map, but with two lists ( fn will normally be a binary function )
     * @param {Function} fn A function to be applied to each element of both lists
     * @param {List} xs A second list to zip with
     * @return {List} A new list including mapped elements from both lists
     */
    zipWith(fn, xs) {
        if (this.isInfinite && xs.isInfinite) {
            const thisGenerator = this.infFunction();
            const xsGenerator = xs.infFunction();
            const genFunc = function* generatorFunc() {
                for (let i = 0; ; i += 1) {
                    const thisVal = thisGenerator.next();
                    const otherVal = xsGenerator.next();
                    yield fn(thisVal.value, otherVal.value);
                }
            };
            return new List(genFunc);
        }
        const other = Array.isArray(xs) ? List.fromList(xs) : xs;
        const length = Math.min(this.length(), other.length());
        const newList = [];
        for (let i = 0; i < length; i += 1) {
            const element = this.get(i);
            const otherElement = other.get(i);
            newList.push(fn(element, otherElement));
        }
        return new List(newList);
    }
}

module.exports = List;
