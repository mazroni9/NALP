/**
 * أبعاد تخطيط الغرف: غرفة 5م، درج 3.5م، عمق 7م
 * العرض الكلي ≤ 52.5م
 */
const ROOM_WIDTH_M = 5;
const STAIR_WIDTH_M = 3.5;
const MAX_WIDTH_M = 52.5;

const roomCountPerFloor = Math.floor((MAX_WIDTH_M - STAIR_WIDTH_M) / ROOM_WIDTH_M);

/** عدد الغرف لكل مبنى: 7م (صف واحد) أو 14م (صفان) */
export const ROOMS_PER_BUILDING = {
  "7m": { perFloor: roomCountPerFloor, total: roomCountPerFloor * 2 },
  "14m": { perFloor: roomCountPerFloor * 2, total: roomCountPerFloor * 4 },
} as const;
