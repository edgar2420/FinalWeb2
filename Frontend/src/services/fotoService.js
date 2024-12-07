const baseURL = "http://localhost:3000/api/fotos";

// Subir una foto a un incidente
export const uploadFoto = async (incidenteId, fotoData) => {
  try {
    const formData = new FormData();
    formData.append("foto", fotoData);  // fotoData debería ser el archivo de la foto

    const response = await fetch(`${baseURL}/${incidenteId}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Usa el token guardado
      },
    });

    if (!response.ok) {
      throw new Error("Error al subir la foto");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Eliminar una foto
export const deleteFoto = async (fotoId) => {
  try {
    const response = await fetch(`${baseURL}/${fotoId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Usa el token guardado
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la foto");
    }

    return "Foto eliminada con éxito";
  } catch (error) {
    throw new Error(error.message);
  }
};
