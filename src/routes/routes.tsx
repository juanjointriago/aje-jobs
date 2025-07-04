import { Navigate, createBrowserRouter } from 'react-router-dom';
import { VCard } from '../components/card/VCard';
import { NotFound } from '../components/NotFound';

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/card/demo" replace />,
        errorElement: <NotFound />,
    },
    {
        path: '/card/:uid',
        element: <VCard />,
        errorElement: <NotFound />,
    }
])

//  <Routes>
//   {/* Ruta principal redirige a una tarjeta de ejemplo */}
//   <Route path="/" element={<Navigate to="/card/demo" replace />} />
  
//   {/* Ruta de la tarjeta con parámetro uid */}
//   <Route path="/card/:uid" element={<VCard />} />
  
//   {/* Ruta catch-all para URLs no encontradas */}
//   <Route path="*" element={<Navigate to="/card/demo" replace />} />
// </Routes>
