import axios from "axios";

const API_URL = "http://localhost:3000/auth";

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; // Devuelve el token y los datos del usuario
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al iniciar sesión");
  }
};


// Logout
export const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al cerrar sesión");
    }

    // Elimina el token del localStorage
    localStorage.removeItem('token');
  } catch (error) {
    throw new Error(error.message);
  }
};

// Obtener datos del usuario autenticado (me)
export const getMe = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los datos del usuario");
    }

    const data = await response.json();
    return data.usuario;
  } catch (error) {
    throw new Error(error.message);
  }
};
