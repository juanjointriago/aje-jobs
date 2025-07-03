import { useState } from 'react'
import { FiUser, FiSun, FiMoon, FiRotateCw } from 'react-icons/fi'

function TestApp() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDarkMode 
        ? 'bg-gray-900' 
        : 'bg-gray-100'
    }`}>
      <div className="w-80 h-96 relative">
        <div className={`w-full h-full rounded-xl p-6 flex flex-col items-center justify-center relative ${
          isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-800'
        }`}>
          {/* Botón de tema */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="absolute top-4 left-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          >
            {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>

          {/* Botón de flip */}
          <FiRotateCw className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full p-2" />

          {/* Contenido */}
          <div className="text-center">
            <FiUser className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-light mb-2">Pedro García</h1>
            <p className="text-sm opacity-80">Director De Tienda</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestApp
