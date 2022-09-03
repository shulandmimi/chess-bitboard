import { attack_map_static, Chess } from './chess/chess';

const chess = new Chess();

chess.load_fen('8/pppppppp/8/8/8/8/P7/RNBQKBNR');

console.log(chess.ascii());

// chess.move({ from: 'a1', to: 'a7' });
// console.log(chess.ascii());

// console.log(bitboard_gui_board(attack_map_static[Pieces.KNIGHT][28], simple_view_board));
