export type BitValueInput = bigint | number | BitBoard;

export class BitBoard {
    value: bigint = 0n;

    constructor(v: BitValueInput = 0n) {
        this.value = this.transform(v);
    }

    or(v: BitValueInput) {
        return this.value | this.transform(v);
    }

    xor(v: BitValueInput) {
        return this.value ^ this.transform(v);
    }

    and(v: BitValueInput) {
        return this.value & this.transform(v);
    }

    not() {
        // this.value = !this.value;
        return this;
    }

    reverse() {
        return ~this.value;
    }

    private transform(v: BitValueInput): bigint {
        if (v === undefined || v === null) return 0n;
        if (v instanceof BitBoard) {
            return v.value;
        }

        return BigInt(v);
    }

    shift_left(v: BitValueInput) {
        return this.value << this.transform(v);
    }

    shift_right(v: BitValueInput) {
        return this.value << this.transform(v);
    }

    assign(v: BitValueInput) {
        return (this.value = this.transform(v));
    }

    toString() {
        return this.value.toString(2).padStart(64, '0');
    }

    [Symbol.toPrimitive](type: 'default' | 'string' | 'number') {
        switch (type) {
            case 'default':
            case 'number':
                return this.value;
            case 'string':
                return this.value.toString();
        }
    }
}
