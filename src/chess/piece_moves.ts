import { file, rank, row, size } from './board';
import { Pieces } from './piece';
import { BitBoard } from './BitBoard/BitBoard';

const board_a = 18374403900871474942n;
const board_h = 9187201950435737471n;
const board_ab = 18229723555195321596n;
const board_hg = 4557430888798830399n;

export function piece_moves(piece: Pieces, position: number, size: number, callback: (position: number, offset: number) => void) {
    switch (piece) {
        case Pieces.QUEEN:
        case Pieces.BISHOP: {
            if (piece === Pieces.BISHOP) break;
        }
        case Pieces.ROOK: {
            let start = file(position) * row,
                end = start + row;
            for (let i = start; i < end; i++) {
                if (i === position) continue;
                callback(position, i);
            }

            start = rank(position);
            end = size;
            for (let i = start; i < size; i += row) {
                if (i === position) continue;
                callback(position, i);
            }
            break;
        }
        case Pieces.KNIGHT: {
            const cur_board = 1n << BigInt(position);

            if ((cur_board >> 17n) & board_h) callback(position, -17);
            if ((cur_board >> 15n) & board_a) callback(position, -15);
            if ((cur_board >> 10n) & board_hg) callback(position, -10);
            if ((cur_board >> 6n) & board_ab) callback(position, -6);

            if ((cur_board << 17n) & board_a) callback(position, 17);
            if ((cur_board << 15n) & board_h) callback(position, 15);
            if ((cur_board << 10n) & board_ab) callback(position, 10);
            if ((cur_board << 6n) & board_hg) callback(position, 6);
        }
        // case Pieces.PAWN: {
        // const null_board = 1n << BigInt(position);
        // }
        case Pieces.KING: {
            const cur_board = 1n << BigInt(position);
            if ((cur_board >> 1n) & board_h) callback(position, -1);
            if ((cur_board >> 7n) & board_a) callback(position, -7);
            callback(position, -8);
            if ((cur_board >> 9n) & board_h) callback(position, -9);

            if ((cur_board << 1n) & board_a) callback(position, 1);
            if ((cur_board << 7n) & board_h) callback(position, 7);
            callback(position, 8);
            if ((cur_board << 9n) & board_a) callback(position, 9);
        }
    }
}

export function genernal_attack_map_static() {
    return [Pieces.ROOK, Pieces.KNIGHT, Pieces.KING].reduce((result, piece) => {
        const piece_map = new Array(size).fill(0n);
        for (let i = 0; i < size; i++) {
            piece_moves(piece, i, size, (position, offset) => {
                piece_map[i] |= 1n << BigInt(position + offset);
            });
        }
        return { ...result, [piece]: piece_map };
    }, {} as Record<Pieces, bigint[]>);
}
