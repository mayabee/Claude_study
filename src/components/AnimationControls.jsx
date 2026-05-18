import '../styles/animations.css'

function AnimationControls({ isPlaying, onToggle }) {
  return (
    <div className="controls">
      <button
        className={`control-btn ${isPlaying ? 'stop' : 'play'}`}
        onClick={onToggle}
        aria-label={isPlaying ? '애니메이션 정지' : '애니메이션 시작'}
      >
        {isPlaying ? '⏸ 춤 멈추기' : '▶ 춤 추기'}
      </button>
      <p className="status-text">
        {isPlaying ? '🎵 신나게 춤추는 중...' : '👆 버튼을 눌러 춤을 시작하세요!'}
      </p>
    </div>
  )
}

export default AnimationControls
