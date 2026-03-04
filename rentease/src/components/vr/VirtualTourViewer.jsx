import { useEffect, useRef } from 'react'

// 360° Virtual Tour Viewer using A-Frame
// Usage: <VirtualTourViewer imageUrl="https://example.com/360-image.jpg" />
export default function VirtualTourViewer({ imageUrl, title }) {
  const containerRef = useRef(null)

  useEffect(() => {
    // Dynamically load A-Frame script if not already loaded
    if (!window.AFRAME) {
      const script = document.createElement('script')
      script.src = 'https://aframe.io/releases/1.4.0/aframe.min.js'
      script.async = true
      document.head.appendChild(script)
    }
  }, [])

  if (!imageUrl) {
    return (
      <div className="bg-gray-100 rounded-2xl flex items-center justify-center h-80">
        <div className="text-center">
          <p className="text-4xl mb-2">🏠</p>
          <p className="font-body text-gray-500 text-sm">No virtual tour available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden" ref={containerRef}>
      <div className="bg-dark text-white px-4 py-2 flex items-center gap-2">
        <span>🥽</span>
        <span className="font-body text-sm font-medium">360° Virtual Tour</span>
        {title && <span className="font-body text-xs text-gray-400 ml-auto">{title}</span>}
      </div>

      {/* A-Frame scene */}
      <div style={{ height: '400px' }}>
        <a-scene
          embedded
          style={{ height: '100%', width: '100%' }}
          vr-mode-ui="enabled: true"
          loading-screen="enabled: false"
        >
          <a-sky src={imageUrl} rotation="0 -130 0" />
          <a-camera>
            <a-cursor color="#16a34a" />
          </a-camera>
        </a-scene>
      </div>

      <p className="font-body text-xs text-gray-400 text-center py-2 bg-gray-50">
        Click and drag to look around · Click VR button for immersive mode
      </p>
    </div>
  )
}
