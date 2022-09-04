import bit_counts from './bit_counts';

/**
 *
 * 获取到 最后一个bit的位置
 *
 *  board:
 *      `0000000000000000000000000011100000101000001110000000000000000000`
 *
 * -board:
 *      `1111111111111111111111111100011111010111110010000000000000000000`
 *
 *  board & -board:
 *      `0000000000000000000000000000000000000000000010000000000000000000`
 *
 *  (board * -board) - 1:
 *      `0000000000000000000000000000000000000000000001111111111111111111`
 * @param board
 * @returns
 */
export default function last_significant(board: bigint) {
    if (board) {
        return bit_counts((board & -board) - 1n);
    }

    return -1;
}
