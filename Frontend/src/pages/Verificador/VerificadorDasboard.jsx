// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Button, Table, Container, Modal, Form } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const VerificadorDashboard = () => {
    const [carreteras, setCarreteras] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        municipio_origen_id: '',
        municipio_destino_id: '',
        estado: 'libre',
        ruta_puntos: [],
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
                'Content-Type': 'application/json'
            };

            // Obtener todas las carreteras
            const responseCarreteras = await fetch('http://localhost:3000/api/carretera', {
                headers: headers
            });

            // Obtener todos los municipios
            const responseMunicipios = await fetch('http://localhost:3000/api/municipio', {
                headers: headers
            });

            if (!responseCarreteras.ok || !responseMunicipios.ok) {
                if (responseCarreteras.status === 401 || responseMunicipios.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    return;
                }
                throw new Error('Error en la autenticación');
            }

            const carreterasData = await responseCarreteras.json();
            const municipiosData = await responseMunicipios.json();

            // Actualizar el estado con todos los datos
            setCarreteras(carreterasData);
            setMunicipios(municipiosData);

        } catch (error) {
            console.error('Error al cargar los datos', error);
            if (error.message === 'Error en la autenticación') {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
    };

    const handleCreate = (type) => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }
        setModalType(type);
        setShowModal(true);
        setEditMode(false);
        setSelectedItem(null);
        setFormData({
            nombre: '',
            descripcion: '',
            municipio_origen_id: '',
            municipio_destino_id: '',
            estado: 'libre',
            ruta_puntos: []
        });
    };

    const handleEdit = (item, type) => {
        setModalType(type);
        setShowModal(true);
        setEditMode(true);
        setSelectedItem(item);
        setFormData({
            ...item,
            ruta_puntos: item.ruta_puntos ? item.ruta_puntos.map(point => ({
                lat: point.latitude || point.lat,
                lng: point.longitude || point.lng
            })) : []
        });
    };

    const handleDelete = async (id, type) => {
        if (window.confirm(`¿Está seguro de eliminar este ${type}?`)) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/api/${type}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} eliminado correctamente`);
                    fetchData(); // Actualizar datos después de eliminar
                } else {
                    alert('Error al eliminar');
                }
            } catch (error) {
                console.error('Error al eliminar:', error);
                alert('Error al eliminar');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const rutaPuntosConCoordenadas = formData.ruta_puntos.map(point => ({
                latitude: point.lat,
                longitude: point.lng
            }));

            const dataToSend = {
                ...formData,
                ruta_puntos: rutaPuntosConCoordenadas,
            };

            if (modalType === 'municipio') {
                const mainPoint = formData.ruta_puntos[0];
                if (mainPoint) {
                    dataToSend.latitude = mainPoint.lat;
                    dataToSend.longitude = mainPoint.lng;
                }

                if (!dataToSend.nombre || !dataToSend.latitude || !dataToSend.longitude) {
                    alert('Faltan datos requeridos para el municipio (nombre, coordenadas).');
                    return;
                }
            }

            if (modalType === 'carretera') {
                if (formData.ruta_puntos.length === 0) {
                    alert('Debe seleccionar al menos un punto en el mapa para la carretera.');
                    return;
                }

                if (!dataToSend.nombre || !dataToSend.municipio_origen_id || !dataToSend.municipio_destino_id || formData.ruta_puntos.length === 0) {
                    alert('Faltan datos requeridos para la carretera (nombre, municipios y puntos de la ruta).');
                    return;
                }
            }

            const url = `http://localhost:3000/api/${modalType}${editMode ? `/${selectedItem.id}` : ''}`;
            const method = editMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                const action = editMode ? 'actualizado' : 'creado';
                alert(`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} ${action} correctamente`);
                
                // Si estamos editando una carretera, actualizamos su estado en el array local
                if (editMode && modalType === 'carretera') {
                    setCarreteras(prevCarreteras => 
                        prevCarreteras.map(carretera => 
                            carretera.id === selectedItem.id 
                                ? {...carretera, ...dataToSend}
                                : carretera
                        )
                    );
                }
                
                await fetchData(); // Actualizar todos los datos
                setShowModal(false);
            } else {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    return;
                }
                const result = await response.json();
                alert('Error: ' + result.message);
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar la solicitud');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const MapEvents = () => {
        useMapEvents({
            click: (e) => {
                const newPoint = {
                    lat: e.latlng.lat,
                    lng: e.latlng.lng
                };
                setFormData(prev => ({
                    ...prev,
                    ruta_puntos: [...prev.ruta_puntos, newPoint]
                }));
            },
        });
        return null;
    };

    const handleCreateIncidente = () => {
        window.location.href = '/incidentes';
    };

    return (
        <Container>
            <h1>Dashboard del Verificador</h1>

            <section>
                <h2>Carreteras</h2>
                <Button onClick={() => handleCreate('carretera')} className="me-2">Crear Carretera</Button>
                <Button onClick={handleCreateIncidente} variant="success">Crear Incidente</Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carreteras.map(carretera => (
                            <tr key={carretera.id}>
                                <td>{carretera.nombre}</td>
                                <td>{carretera.estado}</td>
                                <td>
                                    <Button variant="warning" className="me-2" onClick={() => handleEdit(carretera, 'carretera')}>Editar</Button>
                                    <Button variant="danger" onClick={() => handleDelete(carretera.id, 'carretera')}>Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </section>

            <section>
                <h2>Municipios</h2>
                <Button onClick={() => handleCreate('municipio')}>Crear Municipio</Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {municipios.map(municipio => (
                            <tr key={municipio.id}>
                                <td>{municipio.nombre}</td>
                                <td>
                                    <Button variant="warning" className="me-2" onClick={() => handleEdit(municipio, 'municipio')}>Editar</Button>
                                    <Button variant="danger" onClick={() => handleDelete(municipio.id, 'municipio')}>Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </section>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{`${editMode ? 'Editar' : 'Crear'} ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="nombre" className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder={`Ingrese el nombre de la ${modalType}`}
                                required
                            />
                        </Form.Group>

                        {modalType === 'carretera' && (
                            <>
                                <Form.Group controlId="municipio_origen_id" className="mb-3">
                                    <Form.Label>Municipio Origen</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="municipio_origen_id"
                                        value={formData.municipio_origen_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccione un Municipio</option>
                                        {municipios.map(municipio => (
                                            <option key={municipio.id} value={municipio.id}>
                                                {municipio.nombre}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="municipio_destino_id" className="mb-3">
                                    <Form.Label>Municipio Destino</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="municipio_destino_id"
                                        value={formData.municipio_destino_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccione un Municipio</option>
                                        {municipios.map(municipio => (
                                            <option key={municipio.id} value={municipio.id}>
                                                {municipio.nombre}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="estado" className="mb-3">
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="estado"
                                        value={formData.estado}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="libre">Libre</option>
                                        <option value="bloqueada">Bloqueada</option>
                                    </Form.Control>
                                </Form.Group>
                            </>
                        )}

                        <p>Seleccione puntos en el mapa para crear la ruta:</p>
                        <MapContainer
                            center={[-16.5000, -68.1193]}
                            zoom={6}
                            style={{ height: '400px', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <MapEvents />
                            {formData.ruta_puntos.map((point, index) => (
                                <Marker key={index} position={[point.lat, point.lng]}>
                                    <Popup>
                                        Punto {index + 1}: {point.lat}, {point.lng}
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>

                        <Button variant="primary" type="submit" className="mt-3">
                            {editMode ? 'Guardar Cambios' : `Crear ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default VerificadorDashboard;