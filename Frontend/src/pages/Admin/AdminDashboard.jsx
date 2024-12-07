// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Button, Table, Container, Modal, Form } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css';

const AdminDashboard = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        tipo: 'verificador', // tipo puede ser: 'admin', 'verificador', 'publico'
        password: '',
    });

    const [selectedUser, setSelectedUser] = useState(null);
    const [passwordModal, setPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const response = await fetch('http://localhost:3000/api/usuarios', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const usuariosData = await response.json();
                setUsuarios(usuariosData);
            } else {
                throw new Error('Error al obtener los usuarios');
            }
        } catch (error) {
            console.error(error);
            alert('Error al cargar los usuarios');
        }
    };

    const handleCreateUser = () => {
        setShowModal(true);
        setEditMode(false);
        setFormData({
            nombre: '',
            email: '',
            tipo: 'verificador',
            password: '',
        });
    };

    const handleEditUser = (usuario) => {
        setShowModal(true);
        setEditMode(true);
        setFormData({
            ...usuario,
            password: '', // No mostrar la contraseña
        });
        setSelectedUser(usuario);
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (response.ok) {
                    alert('Usuario eliminado correctamente');
                    fetchUsuarios();
                } else {
                    alert('Error al eliminar el usuario');
                }
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
            }
        }
    };

    const handlePasswordChange = async () => {
        if (!currentPassword || !newPassword) {
            alert('Por favor ingrese la contraseña actual y la nueva contraseña');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/usuarios/${selectedUser.id}/password`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    currentPassword, 
                    newPassword 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Contraseña cambiada correctamente');
                setPasswordModal(false);
                setCurrentPassword('');
                setNewPassword('');
            } else {
                alert(data.msg || 'Error al cambiar la contraseña');
            }
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            alert('Error al procesar la solicitud');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            let url = 'http://localhost:3000/api/usuarios';
            const method = editMode ? 'PUT' : 'POST';

            if (editMode) {
                url = `http://localhost:3000/api/usuarios/${selectedUser.id}`;
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert(editMode ? 'Usuario actualizado' : 'Usuario creado');
                fetchUsuarios();
                setShowModal(false);
            } else {
                alert('Error al guardar el usuario');
            }
        } catch (error) {
            console.error('Error al guardar el usuario:', error);
        }
    };

    return (
        <Container>
            <h1>Dashboard del Administrador</h1>

            <Button onClick={handleCreateUser} variant="primary" className="mb-3">
                Crear Usuario
            </Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.email}</td>
                            <td>{usuario.tipo}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEditUser(usuario)}>
                                    Editar
                                </Button>
                                <Button variant="danger" onClick={() => handleDeleteUser(usuario.id)}>
                                    Eliminar
                                </Button>
                                <Button variant="info" onClick={() => {
                                    setSelectedUser(usuario);
                                    setPasswordModal(true);
                                }}>
                                    Cambiar Contraseña
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? 'Editar Usuario' : 'Crear Usuario'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Tipo de Usuario</Form.Label>
                            <Form.Control
                                as="select"
                                name="tipo"
                                value={formData.tipo}
                                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                required
                            >
                                <option value="admin">Administrador</option>
                                <option value="verificador">Verificador</option>
                                <option value="publico">Público</option>
                            </Form.Control>
                        </Form.Group>

                        {!editMode && (
                            <Form.Group className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        )}

                        <Button variant="primary" type="submit">
                            {editMode ? 'Actualizar' : 'Crear'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={passwordModal} onHide={() => setPasswordModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cambiar Contraseña</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña Actual</Form.Label>
                            <Form.Control
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Nueva Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" onClick={handlePasswordChange}>
                            Cambiar Contraseña
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AdminDashboard;
