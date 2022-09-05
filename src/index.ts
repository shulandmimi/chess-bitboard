import { attack_map_static, Chess, SQUARE_MAP, SQUARE_INDEX_MAP } from './chess/chess';
import { Pieces } from './chess/piece';
import { mask_bishop_attacks } from './chess/static/mask_bishop_attacks';
import bit_counts from './chess/utils/bit_counts';

const chess = new Chess();

chess.load_fen('8/pppppppp/8/8/8/8/P7/RNBQKBNR');

console.log(chess.ascii());

const board = attack_map_static[Pieces.KING][28];

function generate_relevant_btos() {
    const map_bit_counts = new Array(64);
    for (let i = 0; i < 64; i++) {
        map_bit_counts[i] = bit_counts(mask_bishop_attacks(i));
    }

    return map_bit_counts;
}



console.log(generate_relevant_btos());
// console.log(generate_relevant_btos(attack_map_static[Pieces.BISHOP]));
// console.log(generate_relevant_btos(attack_map_static[Pieces.BISHOP]));
// console.log(bitboard_gui_board(attack_map_static[Pieces.ROOK][0]));
// console.log();
// console.log(bitboard_gui_board(mask_rook_attacks(3)));
// console.log(bitboard_gui_board(attack_map_static[Pieces.QUEEN][7], simple_view_board));
// console.log();
// console.log();
// console.log(bitboard_gui_board(attack_map_static[Pieces.QUEEN][56], simple_view_board));
// console.log();
// console.log(bitboard_gui_board(attack_map_static[Pieces.QUEEN][63], simple_view_board));
