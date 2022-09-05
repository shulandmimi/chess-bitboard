let state = 1804289383n;
export default function get_random_32_number() {
    let s = state;

    s ^= s << 13n;
    s ^= s << 17n;
    s ^= s << 5n;

    state = s;

    return s & 0xffffffffn;
}

export function get_random_64_number() {
    let u1, u2, u3, u4;

    u1 = get_random_32_number() & 0xffffn;
    u2 = get_random_32_number() & 0xffffn;
    u3 = get_random_32_number() & 0xffffn;
    u4 = get_random_32_number() & 0xffffn;

    return u1 | (u2 << 16n) | (u3 << 32n) | ((u4 << 48n) & 0xffffffffffffffffn);
}

export function generate_magic_number() {
    return get_random_64_number() & get_random_64_number() & get_random_64_number();
}
