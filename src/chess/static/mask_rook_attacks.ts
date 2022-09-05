// prettier-ignore
export const rook_relevant_bits = [
    12, 11, 11, 11, 11, 11, 11, 12,
    11, 10, 10, 10, 10, 10, 10, 11,
    11, 10, 10, 10, 10, 10, 10, 11,
    11, 10, 10, 10, 10, 10, 10, 11,
    11, 10, 10, 10, 10, 10, 10, 11,
    11, 10, 10, 10, 10, 10, 10, 11,
    11, 10, 10, 10, 10, 10, 10, 11,
    12, 11, 11, 11, 11, 11, 11, 12,
];

function mask_rook_attacks(square: number) {
    let attacks = 0n;

    let r, f;

    let tr = (square / 8) >> 0;
    let tf = square % 8;

    for (r = tr + 1; r <= 6; r++) attacks |= 1n << BigInt(r * 8 + tf);
    for (r = tr + 1; r <= 6; r++) attacks |= 1n << BigInt(r * 8 + tf);
    for (r = tr - 1; r >= 1; r--) attacks |= 1n << BigInt(r * 8 + tf);
    for (f = tf + 1; f <= 6; f++) attacks |= 1n << BigInt(tr * 8 + f);
    for (f = tf - 1; f >= 1; f--) attacks |= 1n << BigInt(tr * 8 + f);

    return attacks;
}
