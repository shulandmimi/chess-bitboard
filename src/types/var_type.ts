export function u64(v: bigint) {
    return v & 0xffffffffffffffffn;
}

export function u32(v: bigint) {
    return v & 0xffffffffn;
}
