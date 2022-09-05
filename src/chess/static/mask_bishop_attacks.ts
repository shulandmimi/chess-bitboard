// prettier-ignore
export const bishop_relevant_bits = [
    6, 5, 5, 5, 5, 5, 5, 5,
    5, 4, 5, 5, 5, 5, 4, 4,
    5, 4, 6, 7, 7, 6, 4, 4,
    5, 4, 6, 8, 8, 6, 4, 4,
    5, 4, 6, 7, 7, 6, 4, 4,
    5, 4, 5, 5, 5, 5, 4, 4,
    5, 5, 5, 5, 5, 5, 5, 5,
    6, 5, 5, 5, 5, 5, 5, 6
]

export function mask_bishop_attacks(square: number) {
    let attacks = 0n;

    let r, f;

    let tr = square / 8;
    let tf = square % 8;

    for (r = tr + 1, f = tf + 1; r <= 6 && f <= 6; r++, f++) attacks |= 1n << BigInt(r * 8 + f);
    for (r = tr - 1, f = tf + 1; r >= 1 && f <= 6; r--, f++) attacks |= 1n << BigInt(r * 8 + f);
    for (r = tr + 1, f = tf - 1; r <= 6 && f >= 1; r++, f--) attacks |= 1n << BigInt(r * 8 + f);
    for (r = tr - 1, f = tf - 1; r >= 1 && f >= 1; r--, f--) attacks |= 1n << BigInt(r * 8 + f);

    return attacks;
}
