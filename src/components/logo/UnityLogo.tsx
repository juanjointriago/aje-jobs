// Componente minimalista para el logo Unity
export const UnityLogo = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const logoPath = isDarkMode ? "/white_logo.svg" : "/black_logo.svg";
  
  return (
    <div className="flex items-center justify-center">
      <img
        src={logoPath}
        alt="Unity Logo"
        className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 opacity-90 hover:opacity-100 transition-opacity duration-300"
        onError={(e) => {
          console.error('❌ Error cargando logo Unity:', e.currentTarget.src);
          console.error('❌ isDarkMode:', isDarkMode, 'Path:', logoPath);
          // Fallback temporal - mostrar texto si falla la imagen
          e.currentTarget.style.display = 'none';
          const fallback = document.getElementById('unity-fallback');
          if (fallback) fallback.style.display = 'block';
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