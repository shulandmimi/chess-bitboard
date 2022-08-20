import { file, rank, row, size } from './board';
import { Pieces } from './piece';

export function piece_moves(piece: Pieces, position: number, size: number, callback: (position: number, offset: number) => void) {
    switch (piece) {
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
        }
    }
}

export function genernal_attack_map_static() {
    return [Pieces.ROOK].reduce((result, piece) => {
        const piece_map = new Array(size).fill(0n);
        for (let i = 0; i < size; i++) {
            piece_moves(Pieces.ROOK, i, size, (position, offset) => {
                piece_map[i] |= 1n << BigInt(offset);
            });
        }
        return { ...result, [piece]: piece_map };
    }, {} as Record<Pieces, bigint[]>);
}
