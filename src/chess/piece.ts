export enum Pieces {
    PAWN = 1,
    ROOK,
    KNIGHT,
    BISHOP,
    QUEEN,
    KING,
}

export const PIECE_STR_MAP_ENUM = {
    p: Pieces.PAWN,
    r: Pieces.ROOK,
    n: Pieces.KNIGHT,
    b: Pieces.BISHOP,
    q: Pieces.QUEEN,
    k: Pieces.KING,
    P: -Pieces.PAWN,
    R: -Pieces.ROOK,
    N: -Pieces.KNIGHT,
    B: -Pieces.BISHOP,
    Q: -Pieces.QUEEN,
    K: -Pieces.KING,
};

export const PIECE_ENUM_MAP_STR = {
    [Pieces.PAWN]: 'p',
    [Pieces.ROOK]: 'r',
    [Pieces.KNIGHT]: 'n',
    [Pieces.BISHOP]: 'b',
    [Pieces.QUEEN]: 'q',
    [Pieces.KING]: 'k',
    [-Pieces.PAWN]: 'P',
    [-Pieces.ROOK]: 'R',
    [-Pieces.KNIGHT]: 'N',
    [-Pieces.BISHOP]: 'B',
    [-Pieces.QUEEN]: 'Q',
    [-Pieces.KING]: 'K',
};
