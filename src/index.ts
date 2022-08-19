type BitValueInput = bigint | number | BitBoard;

class BitBoard {
    value: bigint = 0n;

    constructor(v: BitValueInput = 0n) {
        this.value = this.transform(v);
    }

    or(v: BitValueInput) {
        return this.value | this.transform(v);
    }

    xor(v: BitValueInput) {
        return this.value ^ this.transform(v);
    }

    and(v: BitValueInput) {
        return this.value & this.transform(v);
    }

    not() {
        // this.value = !this.value;
        return this;
    }

    reverse() {
        return ~this.value;
    }

    private transform(v: BitValueInput): bigint {
        if (v === undefined || v === null) return 0n;
        if (v instanceof BitBoard) {
            return v.value;
        }

        return BigInt(v);
    }

    shift_left(v: BitValueInput) {
        return this.value << this.transform(v);
    }

    shift_right(v: BitValueInput) {
        return this.value << this.transform(v);
    }

    assign(v: BitValueInput) {
        return (this.value = this.transform(v));
    }

    toString() {
        return this.value.toString(2).padStart(64, '0');
    }

    [Symbol.toPrimitive](type: 'default' | 'string' | 'number') {
        switch (type) {
            case 'default':
            case 'number':
                return this.value;
            case 'string':
                return this.value.toString();
        }
    }
}

const a = new BitBoard(1);
const b = new BitBoard(2);

// const WHITE_BOARD = new BitBoard();

// WHITE_BOARD.or(0x4ff);

// console.log(WHITE_BOARD.value);

let WHITE_PAWN = new BitBoard();
let WHITE_BOARD = new BitBoard();
let WHITE_QUEE_ROOK = new BitBoard();

const mask: BitBoard[] = [];

enum Pieces {
    PAWN = 1,
    ROOK,
    KNIGHT,
    BISHOP,
    QUEEN,
    KING,
}

const PIECE_STR_MAP_ENUM = {
    p: Pieces.PAWN,
    r: Pieces.ROOK,
    n: Pieces.KNIGHT,
    b: Pieces.BISHOP,
    q: Pieces.QUEEN,
    k: Pieces.KING,
};

const PIECE_ENUM_MAP_STR = {
    [Pieces.PAWN]: 'p',
    [Pieces.ROOK]: 'r',
    [Pieces.KNIGHT]: 'n',
    [Pieces.BISHOP]: 'b',
    [Pieces.QUEEN]: 'q',
    [Pieces.KING]: 'k',
};

enum Color {
    white = 0x00,
    black = 0x80,
}

const FEN_START = 'RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbqkbnr';

class ChessPosition {
    piece_in_square: number[] = new Array(64);

    mask: BitBoard[] = new Array(64);

    white_pawns = new BitBoard();
    black_pawns = new BitBoard();
    white_knights = new BitBoard();
    black_knights = new BitBoard();
    bishops_queens = new BitBoard();
    rooks_queens = new BitBoard();
    white_bishops = new BitBoard();
    black_bishops = new BitBoard();
    white_rooks = new BitBoard();
    black_rooks = new BitBoard();
    white_queens = new BitBoard();
    black_queens = new BitBoard();
    white_pieces = new BitBoard();
    black_pieces = new BitBoard();
    rotate90 = new BitBoard();
    rotate45 = new BitBoard();
    rotate315 = new BitBoard();

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
            switch (this.piece_in_square[i]) {
                case -Pieces.ROOK: {
                    this.rooks_queens.assign(this.rooks_queens.or(this.mask[i]));
                    this.white_pieces.assign(this.white_pieces.or(this.mask[i]));
                    this.white_queens.assign(this.white_queens.or(this.mask[i]));
                    break;
                }

                case Pieces.PAWN: {
                    // @ts-ignore
                    this.black_pawns.assign(this.black_pawns | this.mask[i]);
                    // @ts-ignore
                    this.black_pieces.assign(this.black_pieces | this.mask[i]);

                    break;
                }
            }
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
                [this.white_bishops, Pieces.BISHOP],
                [this.white_knights, Pieces.KNIGHT],
                [this.white_pawns, Pieces.PAWN],
                [this.white_queens, Pieces.QUEEN],
                [this.white_rooks, Pieces.ROOK],
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
}

type Square = number;

const SQUARE_MAP = {
    a8: 0,
    a7: 9,
    a1: 56,
};

class Chess {
    player: Color = Color.white;
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
                    // @ts-ignore
                } else if (PIECE_STR_MAP_ENUM[row[j].toLocaleLowerCase()]) {
                    const piece = row[j];
                    // @ts-ignore
                    pieces[i * 8 + j] = piece >= 'a' && piece <= 'z' ? -PIECE_STR_MAP_ENUM[row[j]] : PIECE_STR_MAP_ENUM[row[j].toLocaleLowerCase()];
                }
            }
        }

        this.position = new ChessPosition(pieces);
    }

    move({ from, to }: { from: Square; to: Square }) {
        const white = !(this.player & Color.black);

        const [from_board, to_board] = [
            white ? this.position.white_pieces : this.position.black_pieces,
            !white ? this.position.black_pieces : this.position.white_pieces,
        ];
    }

    ascii() {
        const board: string[][] = [];
        for (let i = 0; i < 64; i++) {
            if (i % 8 === 0) {
                board.push([]);
            }
            const piece = this.position.piece_at(i);

            // @ts-ignore
            let piece_str: string = piece !== null ? PIECE_ENUM_MAP_STR[Math.abs(piece)] : '';
            if (piece !== null && piece >= 0) piece_str = piece_str.toLocaleUpperCase();

            board[board.length - 1].push(piece ? piece_str : '-');
        }

        return board.map(row => row.map(item => item.padStart(4, ' ')).join('')).join('\n');
    }
}

const chess = new Chess();

// chess.load_fen();

// chess.load_fen('8/8/8/8/8/8/p7/rnbqkbnr');
console.log(chess.ascii());
console.log(chess.position.black_pieces);
chess.move({ from: SQUARE_MAP.a1, to: SQUARE_MAP.a7 });
// console.log(chess.position.mask, chess.position.mask.length);
