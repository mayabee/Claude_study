import './styles/global.css'
import DancingCat from './components/DancingCat'
import AnimationControls from './components/AnimationControls'
import useAnimation from './hooks/useAnimation'

function App() {
  const { isPlaying, toggle } = useAnimation()

  return (
    <div className="app">
      <header>
        <h1>🐱 고양이 댄스 파티 🐱</h1>
        <p>버튼을 눌러 고양이와 함께 춤춰요!</p>
      </header>

      <main>
        <DancingCat isPlaying={isPlaying} />
        <AnimationControls isPlaying={isPlaying} onToggle={toggle} />
      </main>
    </div>
  )
}

export default App
