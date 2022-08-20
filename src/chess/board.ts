export const row = 8;
export const col = 8;
export const size = 64;

/** 行 */
export const rank = (position: number) => position % 8;
/** 列 */
export const file = (position: number) => (position / 8) >> 0;
