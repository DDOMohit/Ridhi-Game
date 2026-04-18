import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { UserPlus, Play, Bot } from 'lucide-react';

export function SetupScreen() {
  const { players, addPlayer, removePlayer, startBoardCreation } = useGameStore();
  const [playerName, setPlayerName] = useState('');

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() && players.length < 4) { // Let's limit to 4 players for UI sanity
      addPlayer(playerName.trim(), false);
      setPlayerName('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2 tracking-tight">
            RIDHI
          </h1>
          <p className="text-slate-500 dark:text-slate-400">The Ultimate Number Strategy Game</p>
        </div>

        <form onSubmit={handleAddPlayer} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter player name..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700 dark:text-slate-200"
            />
            <button
              type="submit"
              disabled={!playerName.trim() || players.length >= 4}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center justify-center font-bold shadow-md shadow-blue-500/30"
            >
              <UserPlus className="w-5 h-5" />
            </button>
          </div>
        </form>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Players ({players.length}/4)</h3>
            {players.length < 4 && (
              <button 
                onClick={() => addPlayer(`AI Bot ${players.filter(p => p.isAI).length + 1}`, true)}
                className="text-xs font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <Bot className="w-4 h-4" /> Add AI
              </button>
            )}
          </div>
          
          <div className="flex flex-col gap-2 min-h-[140px]">
            {players.length === 0 ? (
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-400">
                Add players to start
              </div>
            ) : (
              players.map((player) => (
                <div key={player.id} className="flex items-center justify-between bg-slate-100 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-200/50 dark:border-slate-600/50 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
                      ${player.isAI ? 'bg-purple-500' : 'bg-blue-500'}
                    `}>
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{player.name} {player.isAI && '(AI)'}</span>
                  </div>
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 p-1.5 rounded-lg transition-colors text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          onClick={startBoardCreation}
          disabled={players.length < 2}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 font-bold text-lg shadow-lg shadow-purple-500/30"
        >
          <Play className="w-5 h-5 fill-current" /> Initialize Game
        </button>
      </div>
    </div>
  );
}
