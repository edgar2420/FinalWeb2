const baseURL = "http://localhost:3000/api/usuarios";  // Cambia la URL de acuerdo con tu servidor

// Obtener todos los usuarios
export const getUsuarios = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${baseURL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los usuarios");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Crear un nuevo usuario
export const createUsuario = async (email, password, role) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${baseURL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email, password, role }),
    });

    if (!response.ok) {
      throw new Error("Error al crear el usuario");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Actualizar un usuario (PUT)
export const updateUsuario = async (id, email) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${baseURL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el usuario");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Eliminar un usuario
export const deleteUsuario = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${baseURL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el usuario");
    }

    return { message: "Usuario eliminado correctamente" };
  } catch (error) {
    throw new Error(error.message);
  }
};
