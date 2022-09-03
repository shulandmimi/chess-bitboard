import { Chess } from './chess/chess';

const chess = new Chess();

chess.load_fen('8/pppppppp/8/8/8/8/P7/RNBQKBNR');

console.log(chess.ascii());
// chess.move({ from: SQUARE_MAP.a1, to: SQUARE_MAP.a7 });
// console.log(chess.ascii());
