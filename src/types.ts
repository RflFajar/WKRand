import { LucideIcon } from 'lucide-react';

export interface Activity {
  id: string;
  name: string;
  icon: LucideIcon; // Lucide icon component
  color: string;
  textColor: string;
  borderColor: string;
  shadow: string;
}

export interface GameItem {
  id: string;
  name: string;
}

export interface GameCategory {
  id: string;
  name: string;
  color: string; // Hex string (e.g. "#f43f5e")
  textColor: string; // Hex string
  borderColor: string; // Hex string
  games: GameItem[];
  shadow?: string;
}

export interface SpinResult {
  id: string;
  categoryName: string;
  gameName: string;
  timestamp: number;
}

export interface WishlistGame {
  id: string;
  name: string;
  genre: string;
  addedAt: number;
}


