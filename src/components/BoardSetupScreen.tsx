import { useEffect, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { generateRandomBoard } from '../utils/gameLogic';
import { Check, Shuffle } from 'lucide-react';

export function BoardSetupScreen() {
  const { players, submitBoard } = useGameStore();
  
  // Find the first player who hasn't submitted a complete board yet
  const currentPlayerIndex = players.findIndex(p => p.grid.length !== 25);
  const currentPlayer = players[currentPlayerIndex];

  const [currentGrid, setCurrentGrid] = useState<number[]>([]);
  
  // Array 1-25 to pick from
  const availableNumbers = Array.from({ length: 25 }, (_, i) => i + 1)
    .filter(n => !currentGrid.includes(n));

  useEffect(() => {
    // If the current player to setup is an AI, do it automatically
    if (currentPlayer?.isAI) {
      setTimeout(() => {
        submitBoard(currentPlayer.id, generateRandomBoard());
      }, 800); // Small delay for visual effect
    } else {
      // Reset grid when switching players
      setCurrentGrid([]);
    }
  }, [currentPlayer?.id, currentPlayer?.isAI, submitBoard]);

  if (!currentPlayer) return null;



  const handleAddNumber = (num: number) => {
    if (currentGrid.length < 25) {
      setCurrentGrid([...currentGrid, num]);
    }
  };

  // Improved Grid editing:
  // Let the user just place numbers linearly or tap 'Random'
  const handleRandomize = () => {
    setCurrentGrid(generateRandomBoard());
  };

  const handleClear = () => {
    setCurrentGrid([]);
  };

  const handleSubmit = () => {
    if (currentGrid.length === 25) {
      submitBoard(currentPlayer.id, currentGrid);
    }
  };

  if (currentPlayer.isAI) {
    return (
     <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center space-y-4">
       <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
       <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Setting up board for {currentPlayer.name}...</h2>
     </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-[80vh] p-4 max-w-lg mx-auto">
      <div className="w-full text-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{currentPlayer.name}'s Setup</h2>
        <p className="text-slate-500 dark:text-slate-400">Fill your 5x5 grid</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl w-full flex flex-col items-center">
        {/* GRID DISPLAY */}
        <div className="grid grid-cols-5 gap-2 w-full max-w-[350px] aspect-square mb-8">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className={`
                flex items-center justify-center text-xl font-bold rounded-xl shadow-sm transition-all
                ${currentGrid[i] 
                  ? 'bg-blue-500 text-white shadow-blue-500/40' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-300 dark:border-slate-600'}
              `}
              onClick={() => {
                if (currentGrid[i]) {
                  // Simply pop it off if it's the last one, or remove it and shift?
                  // Removing from middle shifts everything which is confusing. 
                  // Let's just remove specific number and leave null? That complicates state.
                  // For simplicity: only allow 'Clear All' or 'Undo Last'
                  const newGrid = [...currentGrid];
                  newGrid.splice(i, 1);
                  setCurrentGrid(newGrid);
                }
              }}
            >
              {currentGrid[i] || ''}
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex w-full gap-3 mb-6">
          <button
            onClick={handleClear}
            disabled={currentGrid.length === 0}
            className="flex-1 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-semibold transition-colors flex items-center justify-center"
          >
            Clear
          </button>
          <button
            onClick={handleRandomize}
            className="flex-1 flex gap-2 items-center justify-center py-3 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 rounded-xl font-semibold transition-colors"
          >
            <Shuffle className="w-5 h-5" /> Random
          </button>
        </div>

        {/* NUMBER PICKER */}
        {currentGrid.length < 25 && (
          <div className="w-full">
            <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3 px-1">Available Numbers</h3>
            <div className="flex flex-wrap gap-2 justify-center max-h-48 overflow-y-auto p-2">
              {availableNumbers.map(n => (
                <button
                  key={n}
                  onClick={() => handleAddNumber(n)}
                  className="w-12 h-12 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm text-slate-700 dark:text-slate-200 font-bold hover:border-blue-500 hover:text-blue-600 transition-all active:scale-95"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentGrid.length === 25 && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4">
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 transition-all active:scale-95 text-lg"
            >
              <Check className="w-6 h-6" /> Confirm Board
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
