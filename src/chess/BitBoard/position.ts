import { Pieces } from '../piece';
import { BitBoard } from './BitBoard';

export enum Color {
    white = 0x00,
    black = 0x80,
}

export class ChessPosition {
    player: Color = Color.white;

    piece_in_square: number[] = new Array(64);

    mask: BitBoard[] = new Array(64);

    // white
    white_pawns = new BitBoard();
    white_rooks = new BitBoard();
    white_knights = new BitBoard();
    white_bishops = new BitBoard();
    white_queens = new BitBoard();
    white_kings = new BitBoard();
    white_pieces = new BitBoard();

    // black
    black_pawns = new BitBoard();
    black_knights = new BitBoard();
    black_bishops = new BitBoard();
    black_rooks = new BitBoard();
    black_queens = new BitBoard();
    black_kings = new BitBoard();
    black_pieces = new BitBoard();

    constructor(piece_in_square: number[]) {
        this.piece_in_square = piece_in_square;
        this.reset();
        this.reset_by_piece_in_square();
    }

    reset() {
        for (let i = 0; i < 64; i++) {
            this.mask[i] = new BitBoard(1n << BigInt(i));
        }
    }

    reset_by_piece_in_square() {
        for (let i = 0; i < this.mask.length; i++) {
            this.relation_ship_of_piece(this.piece_in_square[i]).forEach((item) => {
                item.assign(item.or(this.mask[i]));
            });
        }
    }

    piece_at(idx: number) {
        // @ts-ignore
        const pieces: bigint = new BitBoard(this.black_pieces | this.white_pieces);
        const offset = 1n << BigInt(idx);
        const t = pieces & offset;

        if (t) {
            const options = [
                [this.black_bishops, Pieces.BISHOP],
                [this.black_knights, Pieces.KNIGHT],
                [this.black_pawns, Pieces.PAWN],
                [this.black_queens, Pieces.QUEEN],
                [this.black_rooks, Pieces.ROOK],
                [this.black_pieces, Pieces.KING],
                [this.white_bishops, Pieces.BISHOP],
                [this.white_knights, Pieces.KNIGHT],
                [this.white_pawns, Pieces.PAWN],
                [this.white_queens, Pieces.QUEEN],
                [this.white_rooks, Pieces.ROOK],
                [this.white_pieces, Pieces.KING],
            ] as const;

            const option = options.find(([bitboard, piece]) => Boolean(bitboard.and(offset)));

            if (option) {
                const [bitboard, piece] = option;
                if (this.white_pieces.and(bitboard)) return -piece;
                if (this.black_pieces.and(bitboard)) return piece;
            }

            return null;
        }
        return null;
    }

    remove_piece(piece: Pieces, offset: number) {
        const target = 1n << BigInt(offset);

        this.relation_ship_of_piece(piece).forEach((item) => {
            item.assign(item.xor(target));
        });
    }

    add_piece(piece: Pieces, offset: number) {
        const target = 1n << BigInt(offset);
        this.relation_ship_of_piece(piece).forEach((item) => {
            item.assign(item.xor(target));
        });
    }

    relation_ship_of_piece(piece: Pieces) {
        switch (piece) {
            case -Pieces.ROOK:
                return [this.white_pieces, this.white_rooks];
            case -Pieces.PAWN:
                return [this.white_pawns, this.white_pieces];
            case -Pieces.QUEEN:
                return [this.white_queens, this.white_pieces];
            case -Pieces.KNIGHT:
                return [this.white_knights, this.white_pieces];
            case -Pieces.KING:
                return [this.white_pieces];
            case -Pieces.BISHOP:
                return [this.white_bishops, this.white_pieces];
            case Pieces.PAWN:
                return [this.black_pawns, this.black_pieces];
        }
        return [];
    }
}
