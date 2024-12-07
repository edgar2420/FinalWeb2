import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/AccesoPrivado/Login.jsx';


import { APIProvider } from '@vis.gl/react-google-maps';
import VerificadorDashboard from './pages/Verificador/VerificadorDasboard.jsx';
import Incidente from './pages/Verificador/Incidente.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import PublicAccess from './pages/Principal/PublicAccess.jsx';


// Definir las rutas de la aplicación
const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicAccess />,
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/verificador-dashboard",
    element: <VerificadorDashboard />,
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/incidentes",
    element: <Incidente />,
  },
]);

// Verificar la API Key de Google Maps
const API_KEY = 'AIzaSyAJDNTEa3FviQZgCBZ4Lv4K-LtO90YcX-8';
if (!API_KEY) {
  console.error("No se ha proporcionado una API Key de Google Maps.");
} else {
  console.log('Tu API Key de Google Maps: ', API_KEY);
}

// Renderizar la aplicación
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <APIProvider apiKey={API_KEY}>
      <RouterProvider router={router} />
    </APIProvider>
  </StrictMode>,
);
