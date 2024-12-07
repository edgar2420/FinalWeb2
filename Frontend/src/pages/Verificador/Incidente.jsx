// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Button, Table, Container, Modal, Form } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Incidente = () => {
    const [incidentes, setIncidentes] = useState([]);
    const [carreteras, setCarreteras] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        tipo: 'transitable_con_desvios',
        descripcion: '',
        carretera_id: '',
        ubicacion: { lat: '', lng: '' },
        fotos: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const [responseIncidentes, responseCarreteras] = await Promise.all([
                fetch('http://localhost:3000/api/incidente', { headers }),
                fetch('http://localhost:3000/api/carretera', { headers }),
            ]);

            if (!responseIncidentes.ok || !responseCarreteras.ok) {
                throw new Error('Error al obtener los datos');
            }

            const incidentesData = await responseIncidentes.json();
            const carreterasData = await responseCarreteras.json();

            setIncidentes(incidentesData);
            setCarreteras(carreterasData);
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
    };

    const handleCreate = () => {
        setShowModal(true);
        setEditMode(false);
        setFormData({
            tipo: 'transitable_con_desvios',
            descripcion: '',
            carretera_id: '',
            ubicacion: { lat: '', lng: '' },
            fotos: []
        });
    };

    const handleEdit = (incidente) => {
        setShowModal(true);
        setEditMode(true);
        setFormData({
            id: incidente.id,
            tipo: incidente.tipo,
            descripcion: incidente.descripcion,
            carretera_id: incidente.carretera_id,
            ubicacion: incidente.ubicacion,
            fotos: incidente.fotos || []
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este incidente?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/api/incidente/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    alert('Incidente eliminado correctamente');
                    fetchData();
                } else {
                    alert('Error al eliminar el incidente');
                }
            } catch (error) {
                console.error('Error al eliminar incidente:', error);
            }
        }
    };

    const handleMapClick = (e) => {
        setFormData((prev) => ({
            ...prev,
            ubicacion: { lat: e.latlng.lat, lng: e.latlng.lng },
        }));
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        const formDataFiles = new FormData();
        
        files.forEach((file) => {
            formDataFiles.append('fotos', file);
        });

        try {
            const token = localStorage.getItem('token');
            // Asegurarse de que formData.id existe para edición o crear un ID temporal para nuevos incidentes
            const incidenteId = formData.id || 'temp';
            const response = await fetch(`http://localhost:3000/api/fotos/${incidenteId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataFiles
            });

            if (response.ok) {
                const uploadedFiles = await response.json();
                setFormData(prev => ({
                    ...prev,
                    fotos: [...prev.fotos, ...uploadedFiles]
                }));
            }
        } catch (error) {
            console.error('Error al subir las fotos:', error);
        }
    };

    const handleDeleteFoto = (index) => {
        setFormData(prev => ({
            ...prev,
            fotos: prev.fotos.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.descripcion || !formData.ubicacion.lat || !formData.ubicacion.lng || !formData.carretera_id) {
            alert('Por favor, completa todos los campos');
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            let url = 'http://localhost:3000/api/incidente';
    
            if (editMode) {
                if (!formData.id) {
                    alert('El ID del incidente es necesario para editar');
                    return;
                }
                url = `http://localhost:3000/api/incidente/${formData.id}`;
            }
    
            const response = await fetch(url, {
                method: editMode ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                alert(editMode ? 'Incidente actualizado' : 'Incidente creado');
                fetchData();
                setShowModal(false);
            } else {
                const result = await response.json();
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error al guardar el incidente:', error);
        }
    };

    const MapEvents = () => {
        useMapEvents({
            click: handleMapClick,
        });
        return null;
    };

    return (
        <Container>
            <h1>Gestión de Incidentes</h1>
            <Button onClick={handleCreate} variant="primary" className="mb-3">
                Crear Incidente
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Descripción</th>
                        <th>Ubicación</th>
                        <th>Carretera</th>
                        <th>Fotos</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {incidentes.map((incidente) => (
                        <tr key={incidente.id}>
                            <td>{incidente.tipo}</td>
                            <td>{incidente.descripcion}</td>
                            <td>
                                {incidente.ubicacion.lat}, {incidente.ubicacion.lng}
                            </td>
                            <td>
                                {carreteras.find((c) => c.id === incidente.carretera_id)?.nombre || 'No asignada'}
                            </td>
                            <td>
                                {incidente.fotos && incidente.fotos.map((foto, index) => (
                                    <img 
                                        key={index}
                                        src={foto.url} 
                                        alt={`Foto ${index + 1}`}
                                        style={{ width: '50px', height: '50px', marginRight: '5px' }}
                                    />
                                ))}
                            </td>
                            <td>
                                <Button variant="warning" className="me-2" onClick={() => handleEdit(incidente)}>
                                    Editar
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(incidente.id)}>
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? 'Editar Incidente' : 'Crear Incidente'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tipo de Incidente</Form.Label>
                            <Form.Control
                                as="select"
                                name="tipo"
                                value={formData.tipo}
                                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                required
                            >
                                <option value="transitable_con_desvios">Transitable con desvíos</option>
                                <option value="no_transitable_conflictos_sociales">No transitable por conflictos sociales</option>
                                <option value="restriccion_vehicular">Restricción vehicular</option>
                                <option value="no_transitable_trafico_cerrado">No transitable - Tráfico cerrado</option>
                                <option value="restriccion_vehicular_especial">Restricción vehicular especial</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Carretera Afectada</Form.Label>
                            <Form.Control
                                as="select"
                                name="carretera_id"
                                value={formData.carretera_id}
                                onChange={(e) => setFormData({ ...formData, carretera_id: e.target.value })}
                                required
                            >
                                <option value="">Seleccione una carretera</option>
                                {carreteras.map((carretera) => (
                                    <option key={carretera.id} value={carretera.id}>
                                        {carretera.nombre}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ubicación</Form.Label>
                            <div style={{ height: '300px', width: '100%' }}>
                                <MapContainer
                                    center={{ lat: -16.290154, lng: -63.588653 }}
                                    zoom={6}
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <MapEvents />
                                    {formData.ubicacion.lat && formData.ubicacion.lng && (
                                        <Marker position={formData.ubicacion}>
                                            <Popup>
                                                {formData.ubicacion.lat}, {formData.ubicacion.lng}
                                            </Popup>
                                        </Marker>
                                    )}
                                </MapContainer>
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Fotos</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileUpload}
                            />
                            <div className="mt-2 d-flex flex-wrap">
                                {formData.fotos.map((foto, index) => (
                                    <div key={index} className="position-relative me-2 mb-2">
                                        <img 
                                            src={foto.url} 
                                            alt={`Foto ${index + 1}`}
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        />
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            style={{ position: 'absolute', top: 0, right: 0 }}
                                            onClick={() => handleDeleteFoto(index)}
                                        >
                                            X
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {editMode ? 'Guardar Cambios' : 'Crear Incidente'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Incidente;
