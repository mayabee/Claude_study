import { useState, useCallback } from 'react'

function useAnimation() {
  const [isPlaying, setIsPlaying] = useState(false)

  const toggle = useCallback(() => {
    setIsPlaying(prev => !prev)
  }, [])

  return { isPlaying, toggle }
}

export default useAnimation
