export interface CursorData {
 id: string;
 name: string;
 image: string;
 imageId: string;
 category: string;
 color: string;
 creator: string;
}

export type CursorCategory = string;

export const CATEGORIES: string[] = ["dot", "circle", "misc", "crosshair"];

export type CursorColor = string;

export const COLORS: string[] = [
 "white", "green", "purple", "pink", "red", "yellow", "blue", "orange", "brown", "black"
];

export const cursors: CursorData[] = [];
