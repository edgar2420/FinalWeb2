const baseURL = "http://localhost:3000/api/incidentes";

// Obtener todos los incidentes
export const fetchIncidentes = async () => {
  try {
    const response = await fetch(baseURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Usa el token guardado
      },
    });

    if (!response.ok) {
      throw new Error("No se pudieron cargar los incidentes");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Crear un nuevo incidente
export const createIncidente = async (incidenteData) => {
  try {
    const response = await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Usa el token guardado
      },
      body: JSON.stringify(incidenteData),
    });

    if (!response.ok) {
      throw new Error("Error al crear el incidente");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Eliminar un incidente
export const deleteIncidente = async (id) => {
  try {
    const response = await fetch(`${baseURL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Usa el token guardado
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el incidente");
    }

    return "Incidente eliminado con éxito";
  } catch (error) {
    throw new Error(error.message);
  }
};
