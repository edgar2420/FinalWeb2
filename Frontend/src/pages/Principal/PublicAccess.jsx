// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import PropTypes from "prop-types";
import { Polyline } from "google-maps-react";
import 'bootstrap/dist/css/bootstrap.min.css';

// Componente para los marcadores en el mapa
const Marker = ({ text, estado, motivo }) => {
  const getMarkerColor = () => {
    switch(estado) {
      case 'bloqueada':
        return 'red';
      case 'libre':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <div style={{ 
      color: getMarkerColor(),
      backgroundColor: '#fff',
      padding: '5px 10px',
      borderRadius: '4px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      cursor: 'pointer'
    }}>
      <div>{text}</div>
      {estado === 'bloqueada' && <div style={{fontSize: '12px'}}>{motivo}</div>}
    </div>
  );
};

Marker.propTypes = {
  text: PropTypes.string.isRequired,
  estado: PropTypes.string.isRequired,
  motivo: PropTypes.string
};

// Componente principal PublicAccess
const PublicAccess = () => {
  const [routes, setRoutes] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [incidentDetails, setIncidentDetails] = useState("");
  const [incidentPhoto, setIncidentPhoto] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [center, setCenter] = useState({ lat: -17.7833, lng: -63.1825 });
  const [zoom, setZoom] = useState(7);

  // Función para obtener rutas desde la API
  const fetchRoutes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/carretera");
      const data = await response.json();
      setRoutes(data);
    } catch (error) {
      console.error("Error al obtener las rutas:", error);
    }
  };

  // Función para obtener municipios desde la API
  const fetchMunicipalities = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/municipio");
      const data = await response.json();
      setMunicipalities(data);
    } catch (error) {
      console.error("Error al obtener los municipios:", error);
    }
  };

  // Función para obtener incidentes desde la API
  const fetchIncidents = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/incidente");
      const data = await response.json();
      updateRoutesWithIncidents(data);
    } catch (error) {
      console.error("Error al obtener los incidentes:", error);
    }
  };

  const updateRoutesWithIncidents = (incidentData) => {
    const updatedRoutes = routes.map(route => {
      const routeIncidents = incidentData.filter(incident => incident.carretera_id === route.id);
      if (routeIncidents.length > 0) {
        return { 
          ...route, 
          estado: 'bloqueada',
          motivo: routeIncidents[0].descripcion // Tomamos el motivo del primer incidente
        };
      }
      return { ...route, estado: 'libre', motivo: null };
    });
    setRoutes(updatedRoutes);
  };

  useEffect(() => {
    fetchRoutes();
    fetchMunicipalities();
    fetchIncidents();
  }, []);

  const handleRouteClick = (route) => {
    setSelectedRoute(route);
    if (route && route.ruta_puntos) {
      const points = JSON.parse(route.ruta_puntos);
      const midPoint = points[Math.floor(points.length/2)];
      setCenter({ lat: midPoint.latitude, lng: midPoint.longitude });
      setZoom(10);
    }
  };

  const filteredRoutes = routes.filter(route => {
    const cumpleFiltroEstado = filtroEstado === 'todos' || route.estado === filtroEstado;
    const cumpleFiltroNombre = route.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    return cumpleFiltroEstado && cumpleFiltroNombre;
  });

  const handleReportIncident = () => {
    setShowIncidentForm(true);
  };

  const handleSubmitIncident = async () => {
    if (!selectedRoute) {
      alert("Por favor seleccione una ruta para reportar el incidente");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('descripcion', incidentDetails);
      formData.append('carretera_id', selectedRoute.id);
      formData.append('foto', incidentPhoto);

      await fetch('http://localhost:3000/api/incidente', {
        method: 'POST',
        body: formData
      });

      alert("Incidencia reportada exitosamente");
      setShowIncidentForm(false);
      fetchIncidents(); // Actualizar los incidentes
    } catch (error) {
      console.error("Error al reportar incidente:", error);
      alert("Error al reportar el incidente");
    }
  };

  const renderRoute = (route) => {
    if (!route || !route.ruta_puntos) return null;

    const path = JSON.parse(route.ruta_puntos).map((point) => ({
      lat: point.latitude,
      lng: point.longitude,
    }));

    return (
      <Polyline
        path={path}
        options={{ 
          strokeColor: route.estado === 'bloqueada' ? 'red' : 'green', 
          strokeWeight: 4 
        }}
      />
    );
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center my-4">Estado de Carreteras</h1>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre de ruta..."
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select 
            className="form-select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="todos">Todas las rutas</option>
            <option value="libre">Rutas Libres</option>
            <option value="bloqueada">Rutas Bloqueadas</option>
          </select>
        </div>
      </div>

      {/* Mapa */}
      <div className="row mb-4">
        <div className="col-12">
          <div style={{ height: "500px", width: "100%" }}>
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyAJDNTEa3FviQZgCBZ4Lv4K-LtO90YcX-8"
              }}
              center={center}
              zoom={zoom}
            >
              {filteredRoutes.map((route) => {
                const origin = municipalities.find(
                  (m) => m.id === route.municipio_origen_id
                );
                const destination = municipalities.find(
                  (m) => m.id === route.municipio_destino_id
                );

                if (origin && destination) {
                  // Marcador de origen
                  return [
                    <Marker
                      key={`origin-${route.id}`}
                      lat={origin.latitude}
                      lng={origin.longitude}
                      text={`${route.nombre} (Inicio)`}
                      estado={route.estado}
                      motivo={route.motivo}
                      onClick={() => handleRouteClick(route)}
                    />,
                    <Marker
                      key={`dest-${route.id}`}
                      lat={destination.latitude}
                      lng={destination.longitude}
                      text={`${route.nombre} (Fin)`}
                      estado={route.estado}
                      motivo={route.motivo}
                      onClick={() => handleRouteClick(route)}
                    />
                  ];
                }
                return null;
              })}

              {selectedRoute && renderRoute(selectedRoute)}
            </GoogleMapReact>
          </div>
        </div>
      </div>

      {/* Lista de rutas */}
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="mb-3">Rutas Disponibles</h2>
          <div className="list-group">
            {filteredRoutes.map((route) => {
              const origin = municipalities.find(
                (m) => m.id === route.municipio_origen_id
              );
              const destination = municipalities.find(
                (m) => m.id === route.municipio_destino_id
              );

              return (
                <div key={route.id} className="list-group-item">
                  {origin && destination ? (
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{route.nombre}</strong> - {origin.nombre} a {destination.nombre}
                        <span className={`badge ms-2 ${route.estado === 'bloqueada' ? 'bg-danger' : 'bg-success'}`}>
                          {route.estado === 'bloqueada' ? 'Bloqueada' : 'Libre'}
                        </span>
                        {route.motivo && <div className="text-muted small">Motivo: {route.motivo}</div>}
                      </div>
                      <button className="btn btn-primary" onClick={() => handleRouteClick(route)}>
                        Ver en Mapa
                      </button>
                    </div>
                  ) : (
                    <span>Datos de ruta incompletos</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reportar incidente */}
      <div className="row mb-4">
        <div className="col-12 text-center">
          <button className="btn btn-danger" onClick={handleReportIncident}>Reportar Incidente</button>
        </div>
      </div>

      {showIncidentForm && (
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Formulario de Reporte de Incidente</h3>
                <div className="mb-3">
                  <label className="form-label">Seleccione la ruta afectada:</label>
                  <select 
                    className="form-select mb-3"
                    value={selectedRoute ? selectedRoute.id : ''}
                    onChange={(e) => {
                      const route = routes.find(r => r.id === parseInt(e.target.value));
                      setSelectedRoute(route);
                    }}
                  >
                    <option value="">Seleccione una ruta</option>
                    {routes.map(route => (
                      <option key={route.id} value={route.id}>{route.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Detalles del incidente"
                    value={incidentDetails}
                    onChange={(e) => setIncidentDetails(e.target.value)}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <input 
                    type="file" 
                    className="form-control" 
                    accept="image/*"
                    onChange={(e) => setIncidentPhoto(e.target.files[0])} 
                  />
                </div>
                {incidentPhoto && (
                  <div className="mb-3">
                    <img src={URL.createObjectURL(incidentPhoto)} alt="Foto del incidente" className="img-thumbnail" width={100} />
                  </div>
                )}
                <button className="btn btn-success" onClick={handleSubmitIncident}>Enviar Incidente</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicAccess;
