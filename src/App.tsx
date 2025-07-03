import './App.css'
import { useState } from 'react'
import { FiRotateCw, FiUser, FiLinkedin, FiExternalLink, FiPlusCircle, FiSun, FiMoon } from 'react-icons/fi'
import { HiOutlineCake } from 'react-icons/hi'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'
import { IoGlobeOutline } from 'react-icons/io5'

function App() {
  const [isFlipped, setIsFlipped] = useState(false)
  const [activeTab, setActiveTab] = useState('contact')
  const [isDarkMode, setIsDarkMode] = useState(true)

  const handleFlipClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFlipped(!isFlipped)
  }

  const handleTabClick = (e: React.MouseEvent, tab: string) => {
    e.stopPropagation()
    setActiveTab(tab)
  }

  const handleAddToContacts = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Aquí puedes agregar la lógica para añadir contacto
    alert('¡Contacto agregado!')
  }

  const handleLinkedInClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open('https://www.linkedin.com/in/pedro-director', '_blank')
  }

  const toggleDarkMode = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDarkMode(!isDarkMode)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'contact':
        return (
          <div className="text-center space-y-4 flex-1 flex flex-col justify-center info-section">
            <div className="space-y-3">
              <h1 className={`text-xl sm:text-2xl lg:text-3xl font-light ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Pedro García</h1>
              <p className={`text-xs sm:text-sm lg:text-base font-light opacity-80 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>Director De Tienda</p>
              <div className="birthday-info inline-flex items-center space-x-3 mt-4">
                <HiOutlineCake className="text-lg sm:text-xl text-yellow-400" />
                <div className="text-left">
                  <p className={`text-xs opacity-70 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Cumpleaños</p>
                  <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>15 de Marzo, 1985</p>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'company':
        return (
          <div className="text-center space-y-4 flex-1 flex flex-col justify-center info-section">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className={`text-xs opacity-70 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Empresa</p>
                <h2 className={`text-lg sm:text-xl lg:text-2xl font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>UnityStores</h2>
              </div>
              <div className="space-y-2">
                <p className={`text-xs opacity-70 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Cargo</p>
                <p className={`text-sm sm:text-base lg:text-lg font-light ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Director de Tienda</p>
              </div>
              <div className={`mt-6 pt-4 border-t ${isDarkMode ? 'border-white/20' : 'border-gray-800/20'}`}>
                <p className={`text-xs opacity-60 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Miembro desde 2019</p>
              </div>
            </div>
          </div>
        )
      
      case 'socials':
        return (
          <div className="text-center space-y-4 flex-1 flex flex-col justify-center info-section">
            <div className="space-y-4">
              <div>
                <p className={`text-xs opacity-70 mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Redes Sociales</p>
              </div>
              <button 
                onClick={handleLinkedInClick}
                className={`linkedin-button flex items-center justify-center space-x-3 w-full rounded-lg transition-all border py-3 ${
                  isDarkMode 
                    ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white' 
                    : 'bg-gray-800/10 border-gray-800/20 hover:bg-gray-800/20 text-gray-800'
                }`}
              >
                <FiLinkedin className="w-6 h-6 sm:w-8 sm:h-8" />
                <div className="text-left flex-1">
                  <p className="text-sm sm:text-base font-medium">LinkedIn</p>
                  <p className="text-xs opacity-70">@pedro-director</p>
                </div>
                <FiExternalLink className="w-4 h-4 opacity-60" />
              </button>
              
              {/* Botón Add to contacts en la sección Socials */}
              <button 
                onClick={handleAddToContacts}
                className="contact-button flex items-center justify-center space-x-3 w-full bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-all border border-green-400/30 py-3"
              >
                <FiPlusCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                <div className="text-center">
                  <p className="text-sm sm:text-base font-medium text-green-400">Agregar Contacto</p>
                </div>
              </button>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-black' 
        : 'bg-gradient-to-br from-gray-100 to-gray-200'
    } flex items-center justify-center p-4`}>
      {/* Contenedor de la tarjeta con perspectiva 3D */}
      <div className="card-container">
        <div className={`card ${isFlipped ? 'flipped' : ''}`}>
          
          {/* FRENTE DE LA TARJETA */}
          <div className="card-face card-front">
            {/* Botón de Modo Claro/Oscuro - Esquina Superior Izquierda */}
            <button 
              onClick={toggleDarkMode}
              className={`theme-button absolute top-4 left-4 sm:top-4 sm:left-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all border z-10 ${
                isDarkMode 
                  ? 'bg-white/20 hover:bg-white/30 border-white/30 text-white' 
                  : 'bg-gray-800/80 hover:bg-gray-800 border-gray-700 text-white'
              }`}
            >
              {isDarkMode ? (
                <FiSun className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <FiMoon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>

            {/* Botón de Giro - Esquina Superior Derecha */}
            <FiRotateCw 
              onClick={handleFlipClick}
              className={`flip-button absolute top-4 right-4 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all border z-10 cursor-pointer ${
                isDarkMode 
                  ? 'bg-white/20 hover:bg-white/30 border-white/30 text-white' 
                  : 'bg-gray-800/80 hover:bg-gray-800 border-gray-700 text-white'
              }`}
            />

            {/* Fondo con tema dinámico */}
            <div className={`h-full flex flex-col items-center justify-between relative px-4 sm:px-6 py-6 sm:py-8 transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-black text-white' 
                : 'bg-white text-gray-800'
            }`}>
              
              {/* Ícono de Persona Superior */}
              <div className="flex flex-col items-center mt-4 sm:mt-6">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 person-icon-container rounded-2xl flex items-center justify-center mb-6 sm:mb-8 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600' 
                    : 'bg-gradient-to-br from-gray-600 to-gray-700 border border-gray-500'
                }`}>
                  <FiUser className={`w-6 h-6 sm:w-8 sm:h-8 ${isDarkMode ? 'text-white' : 'text-white'}`} />
                </div>
              </div>

              {/* Contenido Dinámico según la Pestaña - Mantener posición */}
              <div className="flex-1 flex flex-col justify-center items-center">
                {renderTabContent()}
              </div>

              {/* Pestañas Inferiores */}
              <div className="w-full">
                <div className={`tab-container flex justify-center space-x-1 rounded-lg p-1 ${
                  isDarkMode 
                    ? 'bg-white/10 border border-white/20' 
                    : 'bg-gray-300/80 border border-gray-400/50'
                }`}>
                  <button 
                    onClick={(e) => handleTabClick(e, 'contact')}
                    className={`flex-1 rounded-md font-medium py-2 px-3 transition-all text-sm ${
                      activeTab === 'contact' 
                        ? isDarkMode 
                          ? 'bg-white text-black shadow-sm' 
                          : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                        : isDarkMode 
                          ? 'text-white/70 hover:text-white hover:bg-white/10' 
                          : 'text-gray-800 hover:text-gray-900 hover:bg-white/70 font-medium'
                    }`}
                  >
                    Contact
                  </button>
                  <button 
                    onClick={(e) => handleTabClick(e, 'company')}
                    className={`flex-1 rounded-md font-medium py-2 px-3 transition-all text-sm ${
                      activeTab === 'company' 
                        ? isDarkMode 
                          ? 'bg-white text-black shadow-sm' 
                          : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                        : isDarkMode 
                          ? 'text-white/70 hover:text-white hover:bg-white/10' 
                          : 'text-gray-800 hover:text-gray-900 hover:bg-white/70 font-medium'
                    }`}
                  >
                    Company
                  </button>
                  <button 
                    onClick={(e) => handleTabClick(e, 'socials')}
                    className={`flex-1 rounded-md font-medium py-2 px-3 transition-all text-sm ${
                      activeTab === 'socials' 
                        ? isDarkMode 
                          ? 'bg-white text-black shadow-sm' 
                          : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                        : isDarkMode 
                          ? 'text-white/70 hover:text-white hover:bg-white/10' 
                          : 'text-gray-800 hover:text-gray-900 hover:bg-white/70 font-medium'
                    }`}
                  >
                    Socials
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* PARTE TRASERA DE LA TARJETA */}
          <div className="card-face card-back">
            {/* Botón de Giro - Esquina Superior Derecha (parte trasera) */}
            <FiRotateCw 
              onClick={handleFlipClick}
              className={`flip-button absolute top-4 right-4 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all border z-10 cursor-pointer ${
                isDarkMode 
                  ? 'bg-gray-800/80 hover:bg-gray-800 border-gray-600/50 text-white' 
                  : 'bg-gray-800/90 hover:bg-gray-800 border-gray-700 text-white'
              }`}
            />
            <div className={`h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-900 text-white' 
                : 'bg-white text-gray-800'
            }`}>
              {/* Logo AJE JOBS */}
              <div className="mb-6 sm:mb-8">
                <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold tracking-wider mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>AJE JOBS</h2>
                <p className={`text-xs sm:text-sm lg:text-base tracking-widest text-center ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>PROFESSIONAL SERVICES</p>
              </div>

              {/* Información de Contacto */}
              <div className="space-y-3 sm:space-y-4 text-center w-full max-w-xs sm:max-w-sm">
                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDarkMode ? 'bg-white' : 'bg-gray-800'
                  }`}>
                    <MdEmail className={`text-xs ${isDarkMode ? 'text-gray-900' : 'text-white'}`} />
                  </div>
                  <span className={`text-xs sm:text-sm lg:text-base truncate ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>info@ajejobs.com</span>
                </div>

                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDarkMode ? 'bg-white' : 'bg-gray-800'
                  }`}>
                    <MdPhone className={`text-xs ${isDarkMode ? 'text-gray-900' : 'text-white'}`} />
                  </div>
                  <span className={`text-xs sm:text-sm lg:text-base ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>+1 (555) 123-4567</span>
                </div>

                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDarkMode ? 'bg-white' : 'bg-gray-800'
                  }`}>
                    <IoGlobeOutline className={`text-xs ${isDarkMode ? 'text-gray-900' : 'text-white'}`} />
                  </div>
                  <span className={`text-xs sm:text-sm lg:text-base truncate ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>www.ajejobs.com</span>
                </div>

                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDarkMode ? 'bg-white' : 'bg-gray-800'
                  }`}>
                    <MdLocationOn className={`text-xs ${isDarkMode ? 'text-gray-900' : 'text-white'}`} />
                  </div>
                  <span className={`text-xs sm:text-sm lg:text-base text-center leading-tight ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>123 Business Ave, Suite 100</span>
                </div>
              </div>

              {/* Código QR de Contacto */}
              <div className="mt-4 sm:mt-6 text-center">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 border p-1 mx-auto ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-600' 
                    : 'bg-white border-gray-300'
                }`}>
                  <div className={`w-full h-full qr-pattern opacity-90 ${
                    isDarkMode ? 'bg-white' : 'bg-black'
                  }`}></div>
                </div>
                <p className={`text-xs sm:text-sm mt-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Escanea para contactar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
