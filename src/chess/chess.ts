import { genernal_attack_map_static } from './piece_moves';
import { ChessPosition, Color } from './BitBoard/position';
import { Pieces, PIECE_ENUM_MAP_STR, PIECE_STR_MAP_ENUM } from './piece';

const attack_map_static = genernal_attack_map_static();

export type Square = number;

export const FEN_START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

export const SQUARE_MAP = {
    a8: 0,
    a7: 8,
    a1: 56,
};

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
                }
            }
        }

        this.position = new ChessPosition(pieces);
    }

    move({ from, to }: { from: Square; to: Square }) {
        const white = !(this.position.player & Color.black);

        // 获取需要移动的棋子
        const piece = this.position.piece_at(from);

        if (!piece) return null;

        // 获取移动方局面和相反阵营的局面
        const [from_board, to_board] = [
            white ? this.position.white_pieces : this.position.black_pieces,
            white ? this.position.black_pieces : this.position.white_pieces,
        ];

        // 获取到当前棋子的移动路径
        const attack_map = attack_map_static[Math.abs(piece) as Pieces][from];

        // 是否可以捕获到棋子
        const can_capture = attack_map & (1n << BigInt(to)) & to_board.value;

        if (can_capture) console.log('can capture');
        else console.log('move');

        // 可捕获状态下，消除对方棋子
        if (can_capture) {
            const to_piece = this.position.piece_at(to)!;
            // 在可吃子的情况下，删除敌方棋子
            this.position.remove_piece(to_piece, to);
        }

        // 添加我方棋子到目的地
        this.position.remove_piece(piece, from);
        this.position.add_piece(piece, to);
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
