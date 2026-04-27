import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Bot, User } from 'lucide-react';

export function GameScreen() {
  const { players, currentPlayerIndex, callNumber, playAITurn } = useGameStore();
  const currentPlayer = players[currentPlayerIndex];
  
  const [showPassScreen, setShowPassScreen] = useState(false);
  const [lastPlayerId, setLastPlayerId] = useState(currentPlayer.id);

  useEffect(() => {
    if (currentPlayer.id !== lastPlayerId) {
      if (!currentPlayer.isAI && !players.every(p => p.isAI || p.id === currentPlayer.id)) {
        // If it's a new human player and there are multiple players, show pass screen
        setShowPassScreen(true);
      }
      setLastPlayerId(currentPlayer.id);
    }

    if (currentPlayer.isAI) {
      const timer = setTimeout(() => {
        playAITurn();
      }, 1500); // AI thinking delay
      return () => clearTimeout(timer);
    }
  }, [currentPlayer.id, currentPlayer.isAI, lastPlayerId, playAITurn, players]);

  if (showPassScreen && !currentPlayer.isAI) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
        <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white mb-6 animate-pulse">
          <User className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          Pass to {currentPlayer.name}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
          It's your turn. Make sure nobody else is looking at the screen!
        </p>
        <button
          onClick={() => setShowPassScreen(false)}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all active:scale-95"
        >
          I'm Ready
        </button>
      </div>
    );
  }

  // BINGO Letters component
  const letters = ['B', 'I', 'N', 'G', 'O'];
  
  return (
    <div className="flex flex-col items-center min-h-[80vh] p-2 sm:p-4 max-w-3xl mx-auto w-full">
      {/* HEADER / PROGRESS */}
      <div className="w-full flex justify-between items-end mb-6 px-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            {currentPlayer.isAI ? <Bot className="w-6 h-6 text-purple-500" /> : <User className="w-6 h-6 text-blue-500" />}
            {currentPlayer.name}'s Turn
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Select a number to call</p>
        </div>
        
        {/* BINGO PROGRESS */}
        <div className="flex space-x-1 sm:space-x-2 bg-white dark:bg-slate-800 p-2 sm:p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          {letters.map((char, i) => (
            <div
              key={i}
              className={`
                w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-black text-xl sm:text-2xl rounded-lg transition-all transform duration-500
                ${i < currentPlayer.completedLines
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md scale-110'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-600'}
              `}
            >
              {char}
            </div>
          ))}
        </div>
      </div>

      {/* GAME BOARD */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-[400px]">
        <div className={`grid grid-cols-5 gap-2 w-full aspect-square ${currentPlayer.isAI ? 'opacity-80 pointer-events-none' : ''}`}>
          {currentPlayer.grid.map((num, i) => {
            const isMarked = currentPlayer.marked[i];
            return (
              <button
                key={i}
                disabled={isMarked || currentPlayer.isAI}
                onClick={() => callNumber(num)}
                className={`
                  flex items-center justify-center text-xl sm:text-2xl font-bold rounded-xl shadow-sm transition-all duration-300
                  ${isMarked
                    ? 'bg-slate-800 text-slate-400 dark:bg-slate-900 border-2 border-slate-700 inset-shadow-sm scale-95 opacity-50 relative overflow-hidden'
                    : 'bg-slate-100 hover:bg-blue-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 active:scale-95 border border-slate-200 dark:border-slate-600'}
                `}
              >
                {isMarked && (
                  <div className="absolute inset-0 flex items-center justify-center text-red-500/80">
                    <div className="w-full h-1 bg-red-500/80 transform rotate-45 scale-150 absolute" />
                  </div>
                )}
                {num}
              </button>
            );
          })}
        </div>
        
        {currentPlayer.isAI && (
          <div className="mt-6 flex justify-center items-center gap-3 text-purple-600 dark:text-purple-400">
            <Bot className="w-5 h-5 animate-pulse" />
            <span className="font-semibold animate-pulse">AI is thinking...</span>
          </div>
        )}
      </div>

      {/* OPPONENTS PREVIEW */}
      <div className="mt-8 w-full">
        <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3 px-2">Standings</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {players.map(p => (
            <div key={p.id} className={`p-3 rounded-xl border ${p.id === currentPlayer.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'} shadow-sm`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-slate-700 dark:text-slate-200 truncate pr-2" title={p.name}>{p.name}</span>
                <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-md">
                  {p.completedLines}/5
                </span>
              </div>
              {/* Mini progress bar */}
              <div className="w-full flex gap-1 h-1.5">
                {Array.from({length: 5}).map((_, i) => (
                  <div key={i} className={`flex-1 rounded-full ${i < p.completedLines ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
