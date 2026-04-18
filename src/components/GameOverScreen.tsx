
import { useGameStore } from '../store/useGameStore';
import { Trophy, RefreshCw, Handshake } from 'lucide-react';

export function GameOverScreen() {
  const { players, winnerIds, resetGame } = useGameStore();
  
  const winners = players.filter(p => winnerIds.includes(p.id));
  const isDraw = winners.length > 1;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden">
        {/* Confetti or decorative background could go here */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 dark:from-yellow-400/5 dark:to-orange-500/5" />
        
        <div className="relative z-10 flex flex-col items-center">
          {isDraw ? (
            <div className="w-24 h-24 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-slate-500/40 animate-bounce">
              <Handshake className="w-12 h-12" />
            </div>
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-yellow-500/40 animate-bounce">
              <Trophy className="w-12 h-12" />
            </div>
          )}

          <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 mb-2">
            {isDraw ? "IT's A DRAW!" : "WE HAVE A WINNER!"}
          </h1>
          
          <div className="text-xl font-medium text-slate-600 dark:text-slate-300 mb-8 max-w-[280px]">
            {isDraw ? (
              <p>Multiple players completed RIDHI at the same time: <br/><span className="font-bold text-blue-600 dark:text-blue-400">{winners.map(w => w.name).join(', ')}</span></p>
            ) : (
              <p><span className="font-bold text-2xl text-blue-600 dark:text-blue-400">{winners[0]?.name}</span> has completed RIDHI!</p>
            )}
          </div>

          <div className="w-full space-y-3 mb-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider text-left pl-2">Final Standings</h3>
            <div className="space-y-2">
              {players
                .slice()
                .sort((a, b) => b.completedLines - a.completedLines)
                .map((p, index) => (
                  <div key={p.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-600">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-bold w-4">{index + 1}.</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{p.name} {p.isAI && '(AI)'}</span>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold rounded-lg">
                      {p.completedLines} lines
                    </span>
                  </div>
              ))}
            </div>
          </div>

          <button
            onClick={resetGame}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all active:scale-95 text-lg"
          >
            <RefreshCw className="w-5 h-5" /> Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
