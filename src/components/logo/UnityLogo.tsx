// Componente minimalista para el logo Unity
export const UnityLogo = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const logoPath = !isDarkMode ? "/black_logo.svg" : "/white_logo.svg";
  
  return (
    <div className="flex items-center justify-center">
      <img
        src={'/white_logo.svg'}
        alt="Unity Logo"
        height={40} 
        width={40}
        // className="h-8 w-auto sm:h-9 md:h-10 lg:h-11 xl:h-12 opacity-90 hover:opacity-100 transition-opacity duration-300"
        onError={(e) => {
          console.error('❌ Error cargando logo Unity:', e.currentTarget.src);
          console.error('❌ isDarkMode:', isDarkMode, 'Path:', logoPath);
          // Fallback temporal - mostrar texto si falla la imagen
          e.currentTarget.style.display = 'none';
        }}
        onLoad={() => {
          console.log('✅ Logo Unity cargado exitosamente:', logoPath);
        }}
      />
      {/* Fallback temporal para debugging */}
      <span 
        className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
        style={{ display: 'none' }}
        id="unity-fallback"
      >
        UNITY
      </span>
    </div>
  );
};