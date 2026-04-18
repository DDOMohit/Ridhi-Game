import { create } from 'zustand';
import { countCompletedLines, getAIBestMove } from '../utils/gameLogic';

export type GameStatus = 'setup' | 'board_creation' | 'playing' | 'game_over';

export interface Player {
  id: string;
  name: string;
  isAI: boolean;
  grid: number[];
  marked: boolean[];
  completedLines: number;
}

interface GameState {
  status: GameStatus;
  players: Player[];
  currentPlayerIndex: number;
  numbersCalled: number[];
  winnerIds: string[]; // empty if no winner, contains IDs if someone won, size > 1 if draw
  
  // Actions
  addPlayer: (name: string, isAI: boolean) => void;
  removePlayer: (id: string) => void;
  startBoardCreation: () => void;
  submitBoard: (playerId: string, grid: number[]) => void;
  callNumber: (number: number) => void;
  resetGame: () => void;
  playAITurn: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  status: 'setup',
  players: [],
  currentPlayerIndex: 0,
  numbersCalled: [],
  winnerIds: [],

  addPlayer: (name, isAI) => set((state) => ({
    players: [...state.players, {
      id: crypto.randomUUID(),
      name,
      isAI,
      grid: [],
      marked: Array(25).fill(false),
      completedLines: 0
    }]
  })),

  removePlayer: (id) => set((state) => ({
    players: state.players.filter(p => p.id !== id)
  })),

  startBoardCreation: () => set((state) => ({
    status: 'board_creation',
    players: state.players.map(p => ({
      ...p,
      grid: [],
      marked: Array(25).fill(false),
      completedLines: 0
    }))
  })),

  submitBoard: (playerId, grid) => set((state) => {
    const updatedPlayers = state.players.map(p => 
      p.id === playerId ? { ...p, grid } : p
    );
    
    // Check if everyone has submitted their board
    const allSubmitted = updatedPlayers.every(p => p.grid.length === 25);

    return {
      players: updatedPlayers,
      status: allSubmitted ? 'playing' : 'board_creation',
      currentPlayerIndex: 0,
      numbersCalled: [],
      winnerIds: []
    };
  }),

  callNumber: (calledNumber) => set((state) => {
    if (state.status !== 'playing' || state.numbersCalled.includes(calledNumber)) return state;

    const newNumbersCalled = [...state.numbersCalled, calledNumber];

    let newWinnerIds: string[] = [];
    const updatedPlayers = state.players.map(p => {
      const idx = p.grid.indexOf(calledNumber);
      if (idx === -1) return p;

      const newMarked = [...p.marked];
      newMarked[idx] = true;

      const lines = countCompletedLines(newMarked);

      return {
        ...p,
        marked: newMarked,
        completedLines: lines
      };
    });

    // Check win condition
    const winners = updatedPlayers.filter(p => p.completedLines >= 5);
    if (winners.length > 0) {
      newWinnerIds = winners.map(w => w.id);
      return {
        ...state,
        players: updatedPlayers,
        numbersCalled: newNumbersCalled,
        status: 'game_over',
        winnerIds: newWinnerIds
      };
    }

    // Advance turn to next valid player (could be AI)
    let nextPlayerIndex = (state.currentPlayerIndex + 1) % updatedPlayers.length;

    return {
      ...state,
      players: updatedPlayers,
      numbersCalled: newNumbersCalled,
      currentPlayerIndex: nextPlayerIndex
    };
  }),

  playAITurn: () => {
    const state = get();
    if (state.status !== 'playing') return;

    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer.isAI) return;

    // Simulate thinking delay if calling this directly? 
    // Usually best done in a useEffect in the component. We'll rely on the UI to call `callNumber` after a delay.
    const bestNum = getAIBestMove(currentPlayer.grid, currentPlayer.marked);
    if (bestNum !== -1) {
      state.callNumber(bestNum);
    }
  },

  resetGame: () => set({
    status: 'setup',
    players: [],
    currentPlayerIndex: 0,
    numbersCalled: [],
    winnerIds: []
  })
}));
