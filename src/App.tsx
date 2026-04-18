
import { useGameStore } from './store/useGameStore'
import { SetupScreen } from './components/SetupScreen'
import { BoardSetupScreen } from './components/BoardSetupScreen'
import { GameScreen } from './components/GameScreen'
import { GameOverScreen } from './components/GameOverScreen'

function App() {
  const { status } = useGameStore()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-blue-200 dark:selection:bg-blue-900 transition-colors duration-300">
      <main className="container mx-auto pb-10">
        {status === 'setup' && <SetupScreen />}
        {status === 'board_creation' && <BoardSetupScreen />}
        {status === 'playing' && <GameScreen />}
        {status === 'game_over' && <GameOverScreen />}
      </main>
    </div>
  )
}

export default App
