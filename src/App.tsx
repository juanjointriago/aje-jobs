import "./App.css";
import { Routes, Route, Navigate } from 'react-router-dom';
import { VCard } from "./components/card/VCard";

function App() {
  return (
    <Routes>
      {/* Ruta principal redirige a una tarjeta de ejemplo */}
      <Route path="/" element={<Navigate to="/card/demo" replace />} />
      
      {/* Ruta de la tarjeta con parámetro uid */}
      <Route path="/card/:uid" element={<VCard />} />
      
      {/* Ruta catch-all para URLs no encontradas */}
      <Route path="*" element={<Navigate to="/card/demo" replace />} />
    </Routes>
  );
}

export default App;
