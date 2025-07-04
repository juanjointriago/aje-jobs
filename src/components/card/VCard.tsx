import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../App.css";
import {
  FiRotateCw,
  FiUser,
  FiLinkedin,
  FiExternalLink,
  FiPlusCircle,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { HiOutlineCake } from "react-icons/hi";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { IoGlobeOutline } from "react-icons/io5";
import { useUser } from "../../hooks/useUser";
import { NotFound } from "../NotFound";
import { testFirestoreRules } from "../../utils/testFirestoreRules";
import type { UserData } from "../../interfaces/user.interface";
import { UnityLogo } from "../logo/UnityLogo";



// Componente para el avatar con mejor manejo de errores
const AvatarImage = ({ 
  userData, 
  isDarkMode, 
  displayValue 
}: { 
  userData: UserData | null; 
  isDarkMode: boolean; 
  displayValue: (value: string | undefined, fallback?: string) => string;
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Función mejorada para validar URLs de imagen
  const isValidImageUrl = (url: string | undefined): boolean => {
    if (!url || url.trim() === "" || url === "-------") {
      return false;
    }
    
    // Decodificar la URL para manejar caracteres especiales
    try {
      const decodedUrl = decodeURIComponent(url);
      new URL(decodedUrl);
      return true;
    } catch {
      // Si la decodificación falla, intentar con la URL original
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }
  };

  // Reset error state when userData changes
  useEffect(() => {
    setImageError(false);
    setImageLoading(true);
  }, [userData?.PhotoUrl]);

  const photoUrl = userData?.PhotoUrl;

  // Si no hay URL válida, mostrar ícono directamente
  if (!isValidImageUrl(photoUrl)) {
    return (
      <FiUser
        className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 ${
          isDarkMode ? "text-white" : "text-white"
        }`}
      />
    );
  }

  // Si hubo error de carga, mostrar ícono
  if (imageError) {
    return (
      <FiUser
        className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 ${
          isDarkMode ? "text-white" : "text-white"
        }`}
      />
    );
  }

  return (
    <>
      {imageLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin">
            <FiUser
              className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 opacity-50 ${
                isDarkMode ? "text-white" : "text-white"
              }`}
            />
          </div>
        </div>
      )}
      <img
        src={photoUrl}
        alt={`${displayValue(userData?.Nombres)} ${displayValue(userData?.Apellidos)}`}
        className={`w-full h-full object-cover rounded-full transition-opacity duration-300 ${
          imageLoading ? "opacity-0 absolute" : "opacity-100"
        }`}
        onLoad={() => {
          console.log('✅ Imagen cargada exitosamente:', photoUrl);
          setImageLoading(false);
          setImageError(false);
        }}
        onError={() => {
          console.log('❌ Error cargando imagen:', photoUrl);
          setImageError(true);
          setImageLoading(false);
        }}
        style={{ 
          imageRendering: 'auto',
          objectFit: 'cover',
          backgroundColor: 'transparent'
        }}
      />
    </>
  );
};

export const VCard = () => {
  const { uid } = useParams<{ uid: string }>();
  
  // Si el UID es "demo", usar el UID real de Firebase
  const actualUid = uid === "demo" ? "QcsoVRnPirWZeFWgwm2Q" : uid;
  
  const { userData, loading, error } = useUser(actualUid);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeTab, setActiveTab] = useState("contact");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Debug: Monitorear cambios en isDarkMode
  useEffect(() => {
    console.log('🔄 isDarkMode cambió a:', isDarkMode, 'Logo a usar:', isDarkMode ? 'black_logo.svg' : 'white_logo.svg');
  }, [isDarkMode]);

  const handleFlipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleTabClick = (e: React.MouseEvent, tab: string) => {
    e.stopPropagation();
    setActiveTab(tab);
  };

  const handleAddToContacts = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Validar si hay número de teléfono
    const phoneNumber = userData?.NroCelular;
    if (!phoneNumber || phoneNumber.trim() === "" || phoneNumber === "-------") {
      alert("❌ No hay número de teléfono disponible para agregar a contactos.");
      return;
    }

    // Preparar datos del contacto
    const contactName = `${displayValue(userData?.Nombres)} ${displayValue(userData?.Apellidos)}`.trim();
    const contactOrg = displayValue(userData?.Empresa, "");
    const contactEmail = userData?.Email || "";

    try {
      // Método principal: Crear y descargar vCard (funciona en todos los dispositivos)
      const vCard = createVCard({
        name: contactName,
        organization: contactOrg,
        tel: phoneNumber,
        email: contactEmail,
        url: userData?.LinkedInUrl || userData?.WebSyte || ""
      });
      
      downloadVCard(vCard, contactName);
      
      // Mensaje de éxito con instrucciones
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        alert(`📱 ¡Perfecto! Se ha descargado el contacto "${contactName}.vcf".\n\n📋 Para agregarlo:\n• Busca el archivo en tu carpeta de Descargas\n• Tócalo para abrirlo\n• Confirma para agregar a tus contactos`);
      } else {
        alert(`💻 ¡Listo! Se ha descargado el archivo "${contactName}.vcf".\n\n📋 Para agregarlo:\n• Abre el archivo descargado\n• Se abrirá tu aplicación de contactos\n• Confirma para agregar el contacto`);
      }
      
    } catch (error) {
      console.error('Error al crear vCard:', error);
      alert("❌ Hubo un error al crear el archivo de contacto. Por favor, intenta nuevamente.");
    }
  };

  // Función para crear vCard mejorada
  const createVCard = (contact: {
    name: string;
    organization: string;
    tel: string;
    email: string;
    url: string;
  }) => {
    // Separar nombre y apellido si es posible
    const nameParts = contact.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.name}
N:${lastName};${firstName};;;
ORG:${contact.organization}
TITLE:${displayValue(userData?.Cargo, "")}
TEL;TYPE=CELL:${contact.tel}
EMAIL;TYPE=WORK:${contact.email}
URL:${contact.url}
NOTE:Contacto agregado desde tarjeta digital AJE JOBS
END:VCARD`;
    return vCard;
  };

  // Función para descargar vCard
  const downloadVCard = (vCardContent: string, contactName: string) => {
    const blob = new Blob([vCardContent], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${contactName.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleLinkedInClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const linkedinUrl = userData?.LinkedInUrl || "https://www.linkedin.com/";
    window.open(linkedinUrl, "_blank");
  };

  const toggleDarkMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDarkMode(!isDarkMode);
  };

  const handleTestFirestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🧪 Iniciando pruebas de Firestore...');
    testFirestoreRules();
  };

  // Función para mostrar valor o guiones
  const displayValue = (value: string | undefined, fallback = "-------") => {
    return value || fallback;
  };

  // Función para formatear fecha desde Unix timestamp
  const formatDateFromUnix = (unixTimestamp: string | undefined) => {
    if (!unixTimestamp || unixTimestamp === "-------") {
      return "2019"; // Fallback por defecto
    }
    
    try {
      // Convertir string a número y luego a fecha
      const timestamp = parseInt(unixTimestamp);
      if (isNaN(timestamp)) {
        return unixTimestamp; // Si no es número, devolver como está
      }
      
      // Crear fecha desde timestamp (multiplicar por 1000 si está en segundos)
      const date = new Date(timestamp > 9999999999 ? timestamp : timestamp * 1000);
      
      // Formatear fecha como "Enero 2020" o "15 de Marzo de 2020"
      return date.toLocaleDateString('es-ES', { 
        year: 'numeric',
        month: 'long'
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return unixTimestamp; // Devolver valor original si hay error
    }
  };

  // Función para verificar si una URL es válida (general)
  const isValidUrl = (url: string | undefined): boolean => {
    if (!url || url.trim() === "" || url === "-------") {
      return false;
    }
    
    // Verificar que sea una URL válida
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Debug cuando cambie userData
  useEffect(() => {
    if (userData?.PhotoUrl && import.meta.env.DEV) {
      console.log('🖼️ Debug de imagen:');
      console.log('URL original:', userData.PhotoUrl);
      console.log('URL válida?', isValidUrl(userData.PhotoUrl));
      
      try {
        const urlObj = new URL(userData.PhotoUrl);
        console.log('Host:', urlObj.host);
        console.log('Pathname:', urlObj.pathname);
        console.log('Search params:', urlObj.search);
      } catch (e) {
        console.log('Error parseando URL:', e);
      }
    }
  }, [userData?.PhotoUrl]);

  useEffect(() => {
    // Cargar el estado del modo oscuro desde localStorage al inicializar
    const savedDarkMode = localStorage.getItem("isDarkMode");
    console.log('📱 Cargando modo desde localStorage:', savedDarkMode);
    if (savedDarkMode !== null) {
      const parsedMode = JSON.parse(savedDarkMode);
      console.log('📱 Aplicando modo desde localStorage:', parsedMode);
      setIsDarkMode(parsedMode);
    }
  }, []);

  useEffect(() => {
    // Guardar el estado del modo oscuro en localStorage
    console.log('💾 Guardando modo en localStorage:', isDarkMode);
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Si está cargando, mostrar skeleton
  if (loading) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 to-black"
            : "bg-gradient-to-br from-gray-100 to-gray-200"
        } flex items-center justify-center p-0 md:p-6 lg:p-8 xl:p-12`}
      >
        <div className="card-container w-full h-full min-h-screen md:min-h-0">
          <div className="card">
            <div className="card-face card-front">
              <div
                className={`h-full min-h-screen md:min-h-0 flex flex-col items-center justify-center relative px-1 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-1 sm:py-6 md:py-8 lg:py-10 xl:py-12 transition-colors duration-300 ${
                  isDarkMode ? "bg-black text-white" : "bg-white text-gray-800"
                }`}
              >
                <div className="animate-pulse text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-2xl mx-auto mb-8"></div>
                  <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si hay un error específico de "Usuario no encontrado", mostrar página NotFound
  if (error === "Usuario no encontrado") {
    return <NotFound message="Usuario no encontrado" />;
  }

  // Si hay otro tipo de error, mostrar página NotFound con mensaje genérico
  if (error && !loading) {
    return <NotFound message="Error al cargar la información" />;
  }

 const renderTabContent = () => {
    switch (activeTab) {
      case "contact":
        return (
          <div className="text-center space-y-2 sm:space-y-4 flex-1 flex flex-col justify-center info-section">
            <div className="space-y-2 sm:space-y-3">
              <h1
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {displayValue(userData?.Nombres)}{" "}
                {displayValue(userData?.Apellidos)}
              </h1>
              <p
                className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium opacity-90 ${
                  isDarkMode ? "text-white" : "text-gray-600"
                }`}
              >
                {displayValue(userData?.Cargo, "Cargo no disponible")}
              </p>
              <div className="birthday-info inline-flex items-center space-x-3 mt-4">
                <HiOutlineCake className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-yellow-400" />
                <div className="text-left">
                  <p
                    className={`text-sm sm:text-base md:text-lg lg:text-xl opacity-70 ${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Cumpleaños
                  </p>
                  <p
                    className={`text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {displayValue(userData?.FechaNac, "No disponible")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "company":
        return (
          <div className="text-center space-y-2 sm:space-y-4 flex-1 flex flex-col justify-center info-section">
            <div className="space-y-2 sm:space-y-4">
              <div className="space-y-2">
                <p
                  className={`text-sm sm:text-base md:text-lg lg:text-xl opacity-70 ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Empresa
                </p>
                <h2
                  className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {displayValue(userData?.Empresa, "Empresa no disponible")}
                </h2>
              </div>
              <div className="space-y-2">
                <p
                  className={`text-sm sm:text-base md:text-lg lg:text-xl opacity-70 ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Cargo
                </p>
                <p
                  className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {displayValue(userData?.Cargo, "Cargo no disponible")}
                </p>
              </div>
              <div
                className={`mt-6 pt-4 border-t ${
                  isDarkMode ? "border-white/20" : "border-gray-800/20"
                }`}
              >
                <p
                  className={`text-sm sm:text-base md:text-lg opacity-60 ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Miembro desde {formatDateFromUnix(userData?.CreatedAt)}
                </p>
              </div>
            </div>
          </div>
        );

      case "socials":
        return (
          <div className="text-center space-y-2 sm:space-y-4 flex-1 flex flex-col justify-center info-section">
            <div className="space-y-2 sm:space-y-4">
              <div>
                <p
                  className={`text-sm sm:text-base opacity-70 mb-4 ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Redes Sociales
                </p>
              </div>
              
              {/* Solo mostrar LinkedIn si hay URL válida */}
              {isValidUrl(userData?.LinkedInUrl) && (
                <button
                  onClick={handleLinkedInClick}
                  className={`linkedin-button flex items-center justify-center space-x-3 w-full rounded-lg transition-all border py-3 ${
                    isDarkMode
                      ? "bg-white/10 border-white/20 hover:bg-white/20 text-white"
                      : "bg-gray-800/10 border-gray-800/20 hover:bg-gray-800/20 text-gray-800"
                  }`}
                >
                  <FiLinkedin className="w-8 h-8 sm:w-10 sm:h-10" />
                  <div className="text-left flex-1">
                    <p className="text-base sm:text-lg font-medium">LinkedIn</p>
                    <p className="text-sm sm:text-base opacity-70">{userData?.LinkedInUrl}</p>
                  </div>
                  <FiExternalLink className="w-5 h-5 opacity-60" />
                </button>
              )}
              
              {/* Mensaje cuando no hay LinkedIn */}
              {!isValidUrl(userData?.LinkedInUrl) && (
                <div className={`text-center py-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  <FiLinkedin className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-40" />
                  <p className="text-base sm:text-lg opacity-70">LinkedIn no disponible</p>
                </div>
              )}

              {/* Botón Add to contacts en la sección Socials */}
              <button
                onClick={handleAddToContacts}
                className={`contact-button flex items-center justify-center space-x-3 w-full rounded-lg transition-all border py-3 ${
                  userData?.NroCelular && userData.NroCelular !== "-------"
                    ? "bg-green-500/20 hover:bg-green-500/30 border-green-400/30"
                    : "bg-gray-500/20 hover:bg-gray-500/30 border-gray-400/30"
                }`}
              >
                <FiPlusCircle className={`w-6 h-6 sm:w-8 sm:h-8 ${
                  userData?.NroCelular && userData.NroCelular !== "-------"
                    ? "text-green-400"
                    : "text-gray-400"
                }`} />
                <div className="text-center">
                  <p className={`text-base sm:text-lg font-medium ${
                    userData?.NroCelular && userData.NroCelular !== "-------"
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}>
                    {userData?.NroCelular && userData.NroCelular !== "-------"
                      ? "Agregar Contacto"
                      : "Sin teléfono disponible"
                    }
                  </p>
                </div>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-black"
          : "bg-gradient-to-br from-gray-100 to-gray-200"
      } flex items-center justify-center p-0 md:p-6 lg:p-8 xl:p-12`}
    >
      {/* Contenedor de la tarjeta con perspectiva 3D */}
      <div className="card-container w-full h-full min-h-screen md:min-h-0">
        <div className={`card ${isFlipped ? "flipped" : ""}`}>
          {/* FRENTE DE LA TARJETA */}
          <div className="card-face card-front">
            {/* Botón de Modo Claro/Oscuro - Esquina Superior Izquierda */}
            <button
              onClick={toggleDarkMode}
              className={`theme-button absolute top-2 left-2 sm:top-4 sm:left-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all border z-10 ${
                isDarkMode
                  ? "bg-white/20 hover:bg-white/30 border-white/30 text-white"
                  : "bg-gray-800/80 hover:bg-gray-800 border-gray-700 text-white"
              }`}
            >
              {isDarkMode ? (
                <FiSun className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <FiMoon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>

            {/* Botón de Giro - Esquina Superior Derecha */}
            <button
              onClick={handleFlipClick}
              className={`flip-button absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all border z-10 ${
                isDarkMode
                  ? "bg-white/20 hover:bg-white/30 border-white/30 text-white"
                  : "bg-gray-800/80 hover:bg-gray-800 border-gray-700 text-white"
              }`}
            >
              <FiRotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Botón de Prueba Firestore - Solo en Development */}
            {import.meta.env.DEV && (
              <button
                onClick={handleTestFirestore}
                className={`absolute top-2 right-12 sm:top-4 sm:right-16 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all border z-10 ${
                  isDarkMode
                    ? "bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-300"
                    : "bg-red-500/80 hover:bg-red-500 border-red-500 text-white"
                }`}
                title="Probar reglas de Firestore (Dev)"
              >
                🧪
              </button>
            )}

            {/* Fondo con tema dinámico */}
            <div
              className={`h-full min-h-screen md:min-h-0 flex flex-col items-center justify-between relative px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-2 sm:py-6 md:py-8 lg:py-10 xl:py-12 transition-colors duration-300 ${
                isDarkMode ? "bg-black text-white" : "bg-white text-gray-800"
              }`}
            >
              {/* Logo Unity arriba */}
              <div className="flex items-center justify-center mt-2 sm:mt-3 md:mt-4 lg:mt-5 mb-2 sm:mb-3 md:mb-4 lg:mb-5">
                <UnityLogo isDarkMode={isDarkMode} />
                
              </div>

              {/* Avatar más grande y redondo debajo */}
              <div className="flex flex-col items-center mb-6 sm:mb-8 md:mb-4 lg:mb-6 mt-20 md:mt-0 xl:mt-0">
                <div
                  className={`w-48 h-48 sm:w-56 sm:h-56 md:w-50 md:h-50 lg:w-60 lg:h-60 xl:w-65 xl:h-65 person-icon-container rounded-full flex items-center justify-center ${
                    isDarkMode
                      ? "bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-600"
                      : "bg-gradient-to-br from-gray-600 to-gray-700 border-2 border-gray-500"
                  } overflow-hidden shadow-lg`}
                >
                  <AvatarImage userData={userData} isDarkMode={isDarkMode} displayValue={displayValue} />
                </div>
              </div>

              {/* Contenido Dinámico según la Pestaña - Mantener posición */}
              <div className="flex-1 flex flex-col justify-center items-center px-2">
                {renderTabContent()}
              </div>

              {/* Pestañas Inferiores */}
              <div className="w-full pb-2 sm:pb-0">
                <div
                  className={`tab-container flex justify-center space-x-1 rounded-lg p-1.5 mx-2 sm:mx-0 ${
                    isDarkMode
                      ? "bg-white/10 border border-white/20"
                      : "bg-gray-300/80 border border-gray-400/50"
                  }`}
                >
                  <button
                    onClick={(e) => handleTabClick(e, "contact")}
                    className={`flex-1 rounded-md font-medium py-3 px-3 sm:px-4 transition-all text-sm sm:text-base ${
                      activeTab === "contact"
                        ? isDarkMode
                          ? "bg-white text-black shadow-sm"
                          : "bg-white text-gray-800 shadow-sm border border-gray-200"
                        : isDarkMode
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-gray-800 hover:text-gray-900 hover:bg-white/70 font-medium"
                    }`}
                  >
                    Contact
                  </button>
                  <button
                    onClick={(e) => handleTabClick(e, "company")}
                    className={`flex-1 rounded-md font-medium py-3 px-3 sm:px-4 transition-all text-sm sm:text-base ${
                      activeTab === "company"
                        ? isDarkMode
                          ? "bg-white text-black shadow-sm"
                          : "bg-white text-gray-800 shadow-sm border border-gray-200"
                        : isDarkMode
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-gray-800 hover:text-gray-900 hover:bg-white/70 font-medium"
                    }`}
                  >
                    Company
                  </button>
                  <button
                    onClick={(e) => handleTabClick(e, "socials")}
                    className={`flex-1 rounded-md font-medium py-3 px-3 sm:px-4 transition-all text-sm sm:text-base ${
                      activeTab === "socials"
                        ? isDarkMode
                          ? "bg-white text-black shadow-sm"
                          : "bg-white text-gray-800 shadow-sm border border-gray-200"
                        : isDarkMode
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-gray-800 hover:text-gray-900 hover:bg-white/70 font-medium"
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
            <button
              onClick={handleFlipClick}
              className={`flip-button absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all border z-10 ${
                isDarkMode
                  ? "bg-white/20 hover:bg-white/30 border-white/30 text-white"
                  : "bg-gray-800/80 hover:bg-gray-800 border-gray-700 text-white"
              }`}
            >
              <FiRotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div
              className={`h-full min-h-screen md:min-h-0 flex flex-col items-center justify-center p-1 sm:p-4 md:p-6 lg:p-8 xl:p-12 transition-colors duration-300 ${
                isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
              }`}
            >
              {/* Logo AJE JOBS */}
              <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-10">
                <h2
                  className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-wider mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {displayValue(userData?.Empresa, "AJE JOBS")}
                </h2>
                <p
                  className={`text-xs sm:text-sm md:text-base lg:text-lg tracking-widest text-center ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  PROFESSIONAL SERVICES
                </p>
              </div>

              {/* Información de Contacto */}
              <div className="space-y-2 sm:space-y-3 text-center w-full max-w-xs sm:max-w-sm">
                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <div
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? "bg-white" : "bg-gray-800"
                    }`}
                  >
                    <MdEmail
                      className={`text-xs ${
                        isDarkMode ? "text-gray-900" : "text-white"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs sm:text-sm lg:text-base truncate ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {displayValue(userData?.Email, "info@ajejobs.com")}
                  </span>
                </div>

                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <div
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? "bg-white" : "bg-gray-800"
                    }`}
                  >
                    <MdPhone
                      className={`text-xs ${
                        isDarkMode ? "text-gray-900" : "text-white"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs sm:text-sm lg:text-base ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {displayValue(userData?.NroCelular, "+1 (555) 123-4567")}
                  </span>
                </div>

                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <div
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? "bg-white" : "bg-gray-800"
                    }`}
                  >
                    <IoGlobeOutline
                      className={`text-xs ${
                        isDarkMode ? "text-gray-900" : "text-white"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs sm:text-sm lg:text-base truncate ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {displayValue(userData?.WebSyte, "www.ajejobs.com")}
                  </span>
                </div>

                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <div
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? "bg-white" : "bg-gray-800"
                    }`}
                  >
                    <MdLocationOn
                      className={`text-xs ${
                        isDarkMode ? "text-gray-900" : "text-white"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs sm:text-sm lg:text-base text-center leading-tight ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {displayValue(userData?.City, "Ciudad no disponible")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
