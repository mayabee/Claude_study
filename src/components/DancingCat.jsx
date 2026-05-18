import catSvg from '../assets/images/cat.svg'
import '../styles/animations.css'

function DancingCat({ isPlaying }) {
  return (
    <div className={`cat-container ${isPlaying ? 'dancing' : ''}`}>
      <img src={catSvg} alt="춤추는 고양이" className="cat-image" />
    </div>
  )
}

export default DancingCat
