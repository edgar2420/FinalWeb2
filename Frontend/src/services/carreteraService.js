const baseURL = "http://localhost:3000/api/carreteras";

// Obtener todas las carreteras
export const fetchCarreteras = async () => {
  try {
    const response = await fetch(baseURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Usa el token guardado
      },
    });

    if (!response.ok) {
      throw new Error("No se pudieron cargar las carreteras");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Crear una nueva carretera
export const createCarretera = async (carreteraData) => {
  try {
    const response = await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Usa el token guardado
      },
      body: JSON.stringify(carreteraData),
    });

    if (!response.ok) {
      throw new Error("Error al crear la carretera");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Eliminar una carretera por ID
export const deleteCarretera = async (id) => {
  try {
    const response = await fetch(`${baseURL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Usa el token guardado
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la carretera");
    }

    return "Carretera eliminada con éxito";
  } catch (error) {
    throw new Error(error.message);
  }
};
