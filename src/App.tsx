import './App.css'
import { useState } from 'react'
import { FiRotateCw, FiUser, FiLinkedin, FiExternalLink, FiPlusCircle } from 'react-icons/fi'
import { HiOutlineCake } from 'react-icons/hi'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'
import { IoGlobeOutline } from 'react-icons/io5'

function App() {
  const [isFlipped, setIsFlipped] = useState(false)
  const [activeTab, setActiveTab] = useState('contact')

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'contact':
        return (
          <div className="text-center space-y-4 flex-1 flex flex-col justify-center info-section">
            <div className="space-y-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-light">Pedro García</h1>
              <p className="text-xs sm:text-sm lg:text-base font-light opacity-80">Director De Tienda</p>
              <div className="birthday-info inline-flex items-center space-x-3 mt-4">
                <HiOutlineCake className="text-lg sm:text-xl text-yellow-300" />
                <div className="text-left">
                  <p className="info-label">Cumpleaños</p>
                  <p className="text-xs sm:text-sm info-value">15 de Marzo, 1985</p>
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
                <p className="info-label">Empresa</p>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-medium info-value">UnityStores</h2>
              </div>
              <div className="space-y-2">
                <p className="info-label">Cargo</p>
                <p className="text-sm sm:text-base lg:text-lg font-light info-value">Director de Tienda</p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/20">
                <p className="text-xs opacity-60">Miembro desde 2019</p>
              </div>
            </div>
          </div>
        )
      
      case 'socials':
        return (
          <div className="text-center space-y-4 flex-1 flex flex-col justify-center info-section">
            <div className="space-y-4">
              <div>
                <p className="info-label mb-4">Redes Sociales</p>
              </div>
              <button 
                onClick={handleLinkedInClick}
                className="linkedin-button flex items-center justify-center space-x-3 w-full bg-white/10 rounded-lg transition-all border border-white/20"
              >
                <FiLinkedin className="w-6 h-6 sm:w-8 sm:h-8" />
                <div className="text-left flex-1">
                  <p className="text-sm sm:text-base font-medium">LinkedIn</p>
                  <p className="text-xs opacity-70">@pedro-director</p>
                </div>
                <FiExternalLink className="w-4 h-4 opacity-60" />
              </button>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Contenedor de la tarjeta con perspectiva 3D */}
      <div className="card-container">
        <div className={`card ${isFlipped ? 'flipped' : ''}`}>
          
          {/* FRENTE DE LA TARJETA */}
          <div className="card-face card-front">
            {/* Botón de Giro - Esquina Superior Derecha */}
              <FiRotateCw 
              onClick={handleFlipClick}
              className="flip-button absolute top-4 right-4 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center transition-all border border-white/30 z-10"
              />

            {/* Botón Add to contacts flotante - Esquina Superior Izquierda */}
            {activeTab === 'contact' && (
              <FiPlusCircle 
                onClick={handleAddToContacts}
                className="flip-button absolute top-4 left-4 sm:top-4 sm:left-4 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center transition-all border border-white/30 z-10"
              />
            )}

            {/* Fondo Negro Completo */}
            <div className="bg-black text-white h-full flex flex-col items-center justify-between relative px-4 sm:px-6 py-6 sm:py-8">
              
              {/* Ícono de Persona Superior */}
              <div className="flex flex-col items-center mt-4 sm:mt-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 person-icon-container rounded-2xl flex items-center justify-center mb-6 sm:mb-8">
                  <FiUser className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>

              {/* Contenido Dinámico según la Pestaña - Mantener posición */}
              <div className="flex-1 flex flex-col justify-center items-center">
                {renderTabContent()}
              </div>

              {/* Pestañas Inferiores */}
              <div className="w-full">
                <div className="tab-container flex justify-center space-x-1 rounded-lg">
                  <button 
                    onClick={(e) => handleTabClick(e, 'contact')}
                    className={`flex-1 rounded-md font-medium ${activeTab === 'contact' ? 'tab-active' : 'tab-inactive'}`}
                  >
                    Contact
                  </button>
                  <button 
                    onClick={(e) => handleTabClick(e, 'company')}
                    className={`flex-1 rounded-md font-medium ${activeTab === 'company' ? 'tab-active' : 'tab-inactive'}`}
                  >
                    Company
                  </button>
                  <button 
                    onClick={(e) => handleTabClick(e, 'socials')}
                    className={`flex-1 rounded-md font-medium ${activeTab === 'socials' ? 'tab-active' : 'tab-inactive'}`}
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
              className="flip-button absolute w-8 h-8 sm:w-10 sm:h-10 bg-gray-800/80 hover:bg-gray-800 rounded-full flex items-center justify-center transition-all border border-gray-600/50 z-10"
            />
            <div className="bg-white h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
              {/* Logo AJE JOBS */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-wider text-gray-800 mb-2">AJE JOBS</h2>
                <p className="text-xs sm:text-sm lg:text-base text-gray-500 tracking-widest text-center">PROFESSIONAL SERVICES</p>
              </div>

              {/* Información de Contacto */}
              <div className="space-y-3 sm:space-y-4 text-center w-full max-w-xs sm:max-w-sm">
                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <MdEmail className="text-white text-xs" />
                  </div>
                  <span className="text-xs sm:text-sm lg:text-base text-gray-700 truncate">info@ajejobs.com</span>
                </div>

                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <MdPhone className="text-white text-xs" />
                  </div>
                  <span className="text-xs sm:text-sm lg:text-base text-gray-700">+1 (555) 123-4567</span>
                </div>

                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <IoGlobeOutline className="text-white text-xs" />
                  </div>
                  <span className="text-xs sm:text-sm lg:text-base text-gray-700 truncate">www.ajejobs.com</span>
                </div>

                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <MdLocationOn className="text-white text-xs" />
                  </div>
                  <span className="text-xs sm:text-sm lg:text-base text-gray-700 text-center leading-tight">123 Business Ave, Suite 100</span>
                </div>
              </div>

              {/* Código QR de Contacto */}
              <div className="mt-4 sm:mt-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-300 p-1 mx-auto">
                  <div className="w-full h-full bg-black qr-pattern opacity-90"></div>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Escanea para contactar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
