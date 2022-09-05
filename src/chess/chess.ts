import { genernal_attack_map_static } from './piece_moves';
import { ChessPosition, Color } from './BitBoard/position';
import { Pieces, PIECE_ENUM_MAP_STR, PIECE_STR_MAP_ENUM } from './piece';

export const attack_map_static = genernal_attack_map_static();

export type Square = keyof typeof SQUARE_MAP;

export const FEN_START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

// prettier-ignore
export const SQUARE_MAP = {
    a8: 0,  b8: 1,  c8: 2,  d8: 3,  e8: 4,  f8: 5,  g8: 6,  h8: 7,
    a7: 8,  b7: 9,  c7: 10, d7: 11, e7: 12, f7: 13, g7: 14, h7: 15,
    a6: 16, b6: 17, c6: 18, d6: 19, e6: 20, f6: 21, g6: 22, h6: 23,
    a5: 24, b5: 25, c5: 26, d5: 27, e5: 28, f5: 29, g5: 30, h5: 31,
    a4: 32, b4: 33, c4: 34, d4: 35, e4: 36, f4: 37, g4: 38, h4: 39,
    a3: 40, b3: 41, c3: 42, d3: 43, e3: 44, f3: 45, g3: 46, h3: 47,
    a2: 48, b2: 49, c2: 50, d2: 51, e2: 52, f2: 53, g2: 54, h2: 55,
    a1: 56, b1: 57, c1: 58, d1: 59, e1: 60, f1: 61, g1: 62, h1: 63,
};
// prettier-ignore
export const SQUARE_INDEX_MAP: { [key: number]: Square } = {
    0: 'a8',  1: 'b8',  2: 'c8',  3: 'd8',  4: 'e8',  5: 'f8',  6: 'g8',  7: 'h8',
    8: 'a7',  9: 'b7',  10: 'c7', 11: 'd7', 12: 'e7', 13: 'f7', 14: 'g7', 15: 'h7',
    16: 'a6', 17: 'b6', 18: 'c6', 19: 'd6', 20: 'e6', 21: 'f6', 22: 'g6', 23: 'h6',
    24: 'a5', 25: 'b5', 26: 'c5', 27: 'd5', 28: 'e5', 29: 'f5', 30: 'g5', 31: 'h5',
    32: 'a4', 33: 'b4', 34: 'c4', 35: 'd4', 36: 'e4', 37: 'f4', 38: 'g4', 39: 'h4',
    40: 'a3', 41: 'b3', 42: 'c3', 43: 'd3', 44: 'e3', 45: 'f3', 46: 'g3', 47: 'h3',
    48: 'a2', 49: 'b2', 50: 'c2', 51: 'd2', 52: 'e2', 53: 'f2', 54: 'g2', 55: 'h2',
    56: 'a1', 57: 'b1', 58: 'c1', 59: 'd1', 60: 'e1', 61: 'f1', 62: 'g1', 63: 'h1',
}

export class Chess {
    position!: ChessPosition;

    constructor(fen: string = FEN_START) {
        this.load_fen(fen);
    }

    load_fen(fen: string = FEN_START) {
        const space = fen.indexOf(' ');
        const layout_end = space === -1 ? fen.length : space;
        const layout = fen.slice(0, layout_end).split('/');

        if (layout.length !== 8) {
            return false;
        }

        const pieces = new Array(64);
        for (let i = 0; i < layout.length; i++) {
            const row = layout[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] >= '0' && row[j] <= '8') {
                    j += Number(row[j]);
                } else if (PIECE_STR_MAP_ENUM[row[j]]) {
                    const piece = row[j];
                    pieces[i * 8 + j] = PIECE_STR_MAP_ENUM[piece];
                } else {
                    throw new SyntaxError('FEN char syntax error');
                }
            }
        }

        this.position = new ChessPosition(pieces);
    }

    move({ from, to }: { from: Square; to: Square }) {
        const white = !(this.position.player & Color.black);

        const [from_square, to_square] = [SQUARE_MAP[from], SQUARE_MAP[to]];
        // 获取需要移动的棋子
        const piece = this.position.piece_at(from_square);

        if (!piece) return null;

        // 获取移动方局面和相反阵营的局面
        const [from_board, to_board] = [
            white ? this.position.white_pieces : this.position.black_pieces,
            white ? this.position.black_pieces : this.position.white_pieces,
        ];

        // 获取到当前棋子的移动路径
        const attack_map = attack_map_static[Math.abs(piece) as Pieces][from_square];

        // 是否可以捕获到棋子
        const can_capture = attack_map & (1n << BigInt(to_square)) & to_board.value;

        if (can_capture) console.log('can capture');
        else console.log('move');

        // 可捕获状态下，消除对方棋子
        if (can_capture) {
            const to_piece = this.position.piece_at(to_square)!;
            // 在可吃子的情况下，删除敌方棋子
            this.position.remove_piece(to_piece, to_square);
        }

        // 添加我方棋子到目的地
        this.position.remove_piece(piece, from_square);
        this.position.add_piece(piece, to_square);
    }

    ascii() {
        const board: string[][] = [];
        for (let i = 0; i < 64; i++) {
            if (i % 8 === 0) {
                board.push([]);
            }
            const piece = this.position.piece_at(i);

            let piece_str: string = piece !== null ? PIECE_ENUM_MAP_STR[piece] : '';

            board[board.length - 1].push(piece ? piece_str : '-');
        }

        return [
            board.map((row) => row.map((item) => item.padStart(4, ' ')).join('')).join('\n'),
            '',
            `   bit board: ${this.position.black_pieces.or(this.position.white_pieces)}`,
            '',
        ].join('\n');
    }
}
