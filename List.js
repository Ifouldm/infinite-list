/**
 * Represents a List of finite or infinite length
 */
class List {
    /**
    * Create a List
    * @param {*} list - An existing list
        or a function to generate an infinite list
    * @param {object} [generator] - A generator for an infinite list
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
            this.infGenerator = typeof args[1] === 'object' ? args[1] : this.infFunction();
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
     * Generate an infinite list of all integer numbers starting at 0 and increasing
     * @return {List} An infinite list of all Integers
     */
    static get ALL() {
        return new List(List.all);
    }

    /**
     * Generate an infinite list of all prime numbers starting at 0 and increasing
     * @return {List} An infinite list of all prime numbers
     */
    static get PRIME() {
        return new List(List.primeFunction);
    }

    /**
     * Generate an infinite list of all fibonacci numbers starting at 0 and increasing
     * @return {List} An infinite list of all Fibonacci numbers
     */
    static get FIB() {
        return new List(List.fibFunction);
    }

    /**
     * Generate an infinite list containing the digits of PI
     * @return {List} An infinite list of the digits of PI
     */
    static get PI() {
        return new List(List.piFunction);
    }

    /**
     * Generate a @List from an existing @List or @Array
     * @param {*} list Incoming List
     * @return {List} New List containing list
     */
    static fromList(list) {
        if (list.isInfinite) {
            return new List(list.infFunction, list.infGenerator);
        }
        return new List(list);
    }

    /**
     * Generate an infinite list of successive applications of fn to x
     * @param {function} fn A function to apply to each value
     * @param {any} x Value to be used in function
     * @return {List} An infinite list of all Integers
     */
    static iterate(fn, x) {
        return new List(List.iterateFunction, List.iterateFunction(fn, x));
    }

    /**
     * Generate an infinite list, every element of which is val
     * @param {*} val a value to populate the list with
     * @return {List} An infinite list every element of which is val
     */
    static repeat(val) {
        return new List(List.repeatFunction, List.repeatFunction(val));
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
        return new List(List.cycleFunction, List.cycleFunction(list));
    }

    static* primeFunction() {
        for (let i = 0; ; i += 1) {
            if (List.isPrime(i)) {
                yield i;
            }
        }
    }

    static* cycleFunction(list) {
        let i = 0;
        while (true) {
            const listIndex = i % list.length();
            yield list.get(listIndex);
            i += 1;
        }
    }

    static* iterateFunction(fn, x) {
        let acc = x;
        for (let i = 0; ; i += 1) {
            yield acc;
            acc = fn(acc);
        }
    }

    static* all() {
        let val = 0;
        while (true) {
            yield val;
            val += 1;
        }
    }

    static* repeatFunction(val) {
        while (true) {
            yield val;
        }
    }

    static* piFunction() {
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

    /**
     * Check a number to verify primality
     * @param {Number} num A number to check for primality
     * @return {Boolean} If num is prime
     */
    static isPrime(num) {
        for (let i = 2, s = Math.sqrt(num); i <= s; i += 1) if (num % i === 0) return false;
        return num > 1;
    }

    static* fibFunction() {
        yield 0;
        yield 1;
        let prev = 0;
        let current = 1;
        while (true) {
            const next = current + prev;
            prev = current;
            current = next;
            yield current;
        }
    }

    * filterGen(filterFunction) {
        const generator = this.infFunction();
        // eslint-disable-next-line no-restricted-syntax
        for (const val of generator) {
            if (filterFunction(val)) {
                yield val;
            }
        }
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
        if (this.list.length === 0) {
            return new List();
        }
        return new List(this.list.slice(1));
    }

    /**
     * Retrieve the element of list at index i
     * @param {Number} index The index to look up
     * @return {*} The element at index i
     */
    get(index) {
        if (this.isInfinite) {
            for (let i = 0; i < index; i += 1) {
                this.infGenerator.next();
            }
            return this.infGenerator.return().value;
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
        // TODO: Negative numbers
        const newList = [];
        for (let i = 0; i < n; i += 1) {
            const value = this.isInfinite ? this.infGenerator.next().value : this.get(i);
            newList.push(value);
        }
        return new List(newList);
    }

    /**
     * list without its first ( at most ) n elements ( n may be negative
        or greater than list.length() )
     * @param {Number} quantity The number of elements to drop
     * @return {List} A new List containing all elements after the nth element
     */
    drop(quantity) {
        if (quantity > this.list.length) {
            return new List();
        }
        return new List(this.list.slice(quantity));
    }

    /**
     * the length of list
     * @return {Number} The length of the list
     */
    length() {
        if (this.isInfinite) {
            return Infinity;
        }
        return this.list.length;
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
        if (!element) {
            return this;
        }
        if (this.nil()) {
            this.list.push(element);
        } else {
            this.list.unshift(element);
        }
        return this;
    }

    /**
     * list without its last element, or an empty list for empty list
        ( equals list if list is infinite )
     */
    init() {
        if (this.list.isInfinite) {
            return this;
        }
        return new List(this.list.slice(0, this.list.length - 1));
    }

    /**
     * the last element of list, or undefined for empty list
     * @return The last element of the list
     */
    last() {
        if (this.list.isInfinite) {
            return 'err';
        }
        if (this.nil()) {
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
    slice(start, end) {
        if (end) {
            this.list = this.list.slice(start, end);
        } else {
            this.list = this.list.slice(start);
        }
        return this;
    }

    /**
     * Reverses the list in place
     * @return {List} The List after reversal
     */
    reverse() {
        this.list.reverse();
        return this;
    }

    /**
     * List transformed by function
     * @param {Function} mapfunction The function to be applied to each element
     * @return A new list containing the mapped values
     */
    map(mapfunction) {
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
            return new List(this.filterGen, this.filterGen(filterFunction));
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
        for (let i = 0; i < this.length(); i += 1) {
            const element = this.list[i];
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
        for (let i = 0; i < this.length(); i += 1) {
            const element = this.list[i];
            if (findFunction(element)) {
                return i;
            }
        }
        return undefined;
    }

    /**
     * list flattened; list must be a list of lists (
        behaves differently than .concat() in JavaScript ! )
     * @return {List} A flattened List
     */
    concat() {
        const flattenedList = [];
        if (!this.nil()) {
            if (this.list[0] instanceof List) {
                for (let i = 0; i < this.length(); i += 1) {
                    flattenedList.push(...this.list[i].list);
                }
            } else if (Array.isArray(this.list[0])) {
                for (let i = 0; i < this.length(); i += 1) {
                    flattenedList.push(...this.list[i]);
                }
            }
        }
        return new List(flattenedList);
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
     * @param {*} fn A function to be applied to each element of both lists
     * @param {*} xs A second list to zip with
     * @return {List} A new list including mapped elements from both lists
     */
    zipWith(fn, xs) {
        if (this.isInfinite || xs.isInfinite) {
            this.infFunction.push(fn);
            return this;
        }
        const newList = [];
        for (let i = 0; i < this.length(); i += 1) {
            const element = this.get(i);
            const xsElement = xs.get(i);
            newList.push(fn(element, xsElement));
        }
        return new List(newList);
    }
}

module.exports = List;
