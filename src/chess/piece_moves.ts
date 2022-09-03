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
            const null_board = 1n << BigInt(position);

            if ((null_board >> 17n) & board_h) callback(position, -17);
            if ((null_board >> 15n) & board_a) callback(position, -15);
            if ((null_board >> 10n) & board_hg) callback(position, -10);
            if ((null_board >> 6n) & board_ab) callback(position, -6);

            if ((null_board << 17n) & board_a) callback(position, 17);
            if ((null_board << 15n) & board_h) callback(position, 15);
            if ((null_board << 10n) & board_ab) callback(position, 10);
            if ((null_board << 6n) & board_hg) callback(position, 6);
        }
        case Pieces.PAWN:
        case Pieces.KING: {
        }
    }
}

export function genernal_attack_map_static() {
    return [Pieces.ROOK, Pieces.KNIGHT].reduce((result, piece) => {
        const piece_map = new Array(size).fill(0n);
        for (let i = 0; i < size; i++) {
            piece_moves(piece, i, size, (position, offset) => {
                piece_map[i] |= 1n << BigInt(position + offset);
            });
        }
        return { ...result, [piece]: piece_map };
    }, {} as Record<Pieces, bigint[]>);
}
