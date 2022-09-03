import { attack_map_static, Chess } from './chess/chess';
import { Pieces } from './chess/piece';
import { bitboard_gui_board, simple_view_board } from './utils/bitboard_gui_board';

const chess = new Chess();

chess.load_fen('8/pppppppp/8/8/8/8/P7/RNBQKBNR');

console.log(chess.ascii());

// chess.move({ from: 'a1', to: 'a7' });
// console.log(chess.ascii());

console.log(bitboard_gui_board(attack_map_static[Pieces.QUEEN][0], simple_view_board));
console.log()
console.log(bitboard_gui_board(attack_map_static[Pieces.QUEEN][7], simple_view_board));
console.log()
console.log(bitboard_gui_board(attack_map_static[Pieces.QUEEN][28], simple_view_board));
console.log()
console.log(bitboard_gui_board(attack_map_static[Pieces.QUEEN][56], simple_view_board));
console.log()
console.log(bitboard_gui_board(attack_map_static[Pieces.QUEEN][63], simple_view_board));
