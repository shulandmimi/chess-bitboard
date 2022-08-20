/**
 * 将 bigint 以棋盘的形式展示，主要用于移动图展示
 * @param board
 * @param callback
 * @returns
 */
export function bitboard_gui_board(board: bigint, callback: (bit: 0n | 1n) => string = simple_view_board) {
    const res: string[][] = [];
    for (let i = 0; i < 64; i++) {
        if (i % 8 === 0) {
            res.push([]);
        }
        res[res.length - 1].push(callback(((board >> BigInt(i)) & 1n) as 0n | 1n));
    }

    return res.map(row => row.map(item => item.padStart(4, ' ')).join('')).join('\n');
}

export function simple_view_board(bit: 1n | 0n) {
    return bit === 1n ? '+' : '-';
}
