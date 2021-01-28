class List {
    constructor(...args) {
        this.list = [];
        this.isInfinite = false;
        if (Array.isArray(args[0])) {
            [this.list] = args;
        }
        if (typeof args[0] === 'function') {
            this.isInfinite = true;
            this.algorithm = [args[0]];
        }
    }

    static get empty() {
        return new List();
    }

    static get PRIME() {
        return new List(() => {
            // stub
        });
    }

    static get FIB() {
        return new List(List.fibonacci);
    }

    static get PI() {
        return new List(() => {
            // stub
        });
    }

    static fibonacci(index) {
        if (index === 0) return 0;
        if (index === 1) return 1;
        return List.fibonacci(index - 1) + List.fibonacci(index - 2);
    }

    head() {
        return this.list[0] || undefined;
    }

    tail() {
        if (this.list.length === 0) {
            return new List();
        }
        return new List(this.list.slice(1));
    }

    get(index) {
        if (this.isInfinite) {
            // Apply all algorithms
            return this.algorithm[0](index);
        }
        return this.list[index];
    }

    toList() {
        return Array.from(this.list);
    }

    // TODO: Negative numbers
    take(quantity) {
        if (this.isInfinite) {
            const newList = [];
            for (let i = 0; i < quantity; i += 1) {
                newList.push(this.get(i));
            }
            return new List(newList);
        }
        const quant = Math.min(quantity, this.length());
        return new List(this.list.slice(0, quant));
    }

    drop(quantity) {
        if (quantity > this.list.length) {
            return new List();
        }
        return new List(this.list.slice(quantity));
    }

    length() {
        if (this.isInfinite) {
            return -1;
        }
        return this.list.length;
    }

    nil() {
        return this.length() === 0;
    }

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

    slice(start, end) {
        if (end) {
            this.list = this.list.slice(start, end);
        } else {
            this.list = this.list.slice(start);
        }
        return this;
    }

    reverse() {
        this.list.reverse();
        return this;
    }

    map(mapfunction) {
        const newList = [];
        this.list.forEach((element) => newList.push(mapfunction(element)));
        return new List(newList);
    }

    filter(filterFunction) {
        const newList = [];
        this.list.forEach((element) => {
            if (filterFunction(element)) {
                newList.push(element);
            }
        });
        return new List(newList);
    }

    any(anyFunction) {
        for (let i = 0; i < this.length(); i += 1) {
            const element = this.list[i];
            if (anyFunction(element)) {
                return true;
            }
        }
        return false;
    }

    all(allFunction) {
        for (let i = 0; i < this.length(); i += 1) {
            const element = this.list[i];
            if (!allFunction(element)) {
                return false;
            }
        }
        return true;
    }

    find(findFunction) {
        for (let i = 0; i < this.length(); i += 1) {
            const element = this.list[i];
            if (findFunction(element)) {
                return element;
            }
        }
        return undefined;
    }

    findIndex(findFunction) {
        for (let i = 0; i < this.length(); i += 1) {
            const element = this.list[i];
            if (findFunction(element)) {
                return i;
            }
        }
        return undefined;
    }

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

    elem(element) {
        for (let i = 0; i < this.length(); i += 1) {
            if (element === this.list[i]) {
                return true;
            }
        }
        return false;
    }

    elemIndex(element) {
        for (let i = 0; i < this.length(); i += 1) {
            if (element === this.list[i]) {
                return i;
            }
        }
        return -1;
    }

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

    zipWith(fn, xs) {
        if (this.isInfinite || xs.isInfinite) {
            this.algorithm.push(fn);
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

List.replicate = (n, x) => {
    const replicatedList = [];
    for (let i = 0; i < n; i += 1) {
        replicatedList.push(x);
    }
    return new List(replicatedList);
};

List.repeat = (x) => new List(() => x);

List.iterate = (fn, x) => new List((tot) => {
    let acc = x;
    for (let i = 0; i < tot; i += 1) {
        acc = fn(acc);
    }
    return acc;
});

List.cycle = (xs) => {
    if (xs.isInfinite) {
        return xs;
    }
    return new List((tot) => {
        const xsIndex = tot % xs.length();
        return xs.get(xsIndex);
    });
};

List.fromList = (list) => new List(list);

module.exports = List;
