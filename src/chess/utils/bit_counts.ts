export default function bit_counts(board: bigint) {
    let count = 0;
    while (board) {
        board = board & (board - 1n);
        count++;
    }
    return count;
}
