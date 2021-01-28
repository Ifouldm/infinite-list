class List {
    constructor(...args) {
        this.list = [];
        if (Array.isArray(args[0])) {
            [this.list] = args;
        }
    }

    static empty = new List();

    static replicate = (n, x) => {
        const replicatedList = [];
        for (let i = 0; i < n; i++) {
            replicatedList.push(x);
        }
        return new List(replicatedList);
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
        return this.list[index];
    }

    toList() {
        return Array.from(this.list);
    }

    // TODO: Negative numbers
    take(quantity) {
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
        if (Array.isArray(newList)){
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

    reverse () {
        this.list.reverse();
        return this;
    }
}

//List.empty = () => new List();

List.fromList = (list) => new List(list);

module.exports = List;
