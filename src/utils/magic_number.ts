import { attack_map_static, Square, SQUARE_MAP } from '../chess/chess';
import { Pieces } from '../chess/piece';
import last_significant from '../chess/utils/last_significant';

export function find_magic_number(square: Square, relevant_bits: number, piece: Pieces.BISHOP | Pieces.ROOK) {
    const occupancies = new Array(4096);
    const attacks = new Array(4096);
    const used = new Array(4096);
    const attack_mask = attack_map_static[piece][SQUARE_MAP[square]];

    const occupancy_indicies = 1 << relevant_bits;

    for (let i = 0; i < occupancy_indicies; i++) {
        occupancies[i] = set_occupancy(i, relevant_bits, attack_mask);

    }
}

export function set_occupancy(index: number, bits_in_mask: number, attack_mask: bigint) {
    let occupancy = 0n;

    for (let i = 0; i < bits_in_mask; i++) {
        const square = last_significant(attack_mask);

        attack_mask ^= 1n << BigInt(square);

        if (index & (1 << i)) {
            occupancy |= 1n << BigInt(square);
        }
    }
}
