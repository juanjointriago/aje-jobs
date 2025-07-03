import { FiUser, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface NotFoundProps {
  message?: string;
  showBackButton?: boolean;
}

export const NotFound: React.FC<NotFoundProps> = ({ 
  message = "Usuario no encontrado", 
  showBackButton = true 
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <FiUser className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {message}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No se pudo encontrar la información del usuario solicitado.
          </p>
        </div>
        
        {showBackButton && (
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Volver al inicio
          </button>
        )}
      </div>
    </div>
  );
};
