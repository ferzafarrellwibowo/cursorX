export interface CursorData {
  id: string;
  name: string;
  image: string;
  imageId: string;
  category: CursorCategory;
  color: CursorColor;
  creator: string;
}

export type CursorCategory = "Dot" | "Cross" | "Circle" | "Misc";

export const CATEGORIES: CursorCategory[] = ["Dot", "Cross", "Circle", "Misc"];

export type CursorColor =
  | "Green"
  | "White"
  | "Red"
  | "Yellow"
  | "Purple"
  | "Blue"
  | "Pink"
  | "Black"
  | "Orange"
  | "Brown";

export const COLORS: CursorColor[] = [
  "Green",
  "White",
  "Red",
  "Yellow",
  "Purple",
  "Blue",
  "Pink",
  "Black",
  "Orange",
  "Brown",
];

export const cursors: CursorData[] = [];
