module.exports = {
    isRequestValid: (requiredFields, body, res) => {
        for (const field of requiredFields) {
            if (body[field] === null || body[field] === undefined) {
                res.status(400).json({
                    msg: `Falta el campo ${field}`
                });
                return false;
            }
        }
        return true;
    },
    sendError500: (error, res) => { // Asegúrate de recibir 'res' como argumento
        console.error('Error:', error); // Cambiado a console.error para errores
        res.status(500).json({
            msg: 'Error en el servidor',
            error: error.message // Agregar detalle del error para facilitar depuración
        });
    },
};
