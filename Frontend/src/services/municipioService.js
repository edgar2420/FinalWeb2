const baseURL = "http://localhost:3000/api/municipios";

// Obtener todos los municipios
export const fetchMunicipios = async () => {
  try {
    const response = await fetch(baseURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Usa el token guardado
      },
    });

    if (!response.ok) {
      throw new Error("No se pudieron cargar los municipios");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Crear un nuevo municipio
export const createMunicipio = async (municipioData) => {
  try {
    const response = await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Usa el token guardado
      },
      body: JSON.stringify(municipioData),
    });

    if (!response.ok) {
      throw new Error("Error al crear el municipio");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Eliminar un municipio
export const deleteMunicipio = async (id) => {
  try {
    const response = await fetch(`${baseURL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Usa el token guardado
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el municipio");
    }

    return "Municipio eliminado con éxito";
  } catch (error) {
    throw new Error(error.message);
  }
};
