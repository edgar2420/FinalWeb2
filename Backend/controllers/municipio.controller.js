const db = require("../models");


exports.listMunicipios = async (req, res) => {
    try {
        const municipios = await db.municipios.findAll();
        res.json(municipios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al listar municipios' });
    }
};

exports.createMunicipio = async (req, res) => {
    try {
        console.log('Solicitud POST recibida para crear municipio');  // Log para verificar que la solicitud está llegando
        const { nombre, latitude, longitude } = req.body;

        if (!nombre || !latitude || !longitude) {
            return res.status(400).json({
                msg: 'Faltan datos requeridos',
                required: ['nombre', 'latitude', 'longitude'],
                received: req.body
            });
        }

        console.log('Creando municipio con los datos:', req.body);  // Log de los datos recibidos

        // Intentar crear el municipio
        const nuevoMunicipio = await db.municipios.create({
            nombre: nombre,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
        });

        // Verificar que se haya creado correctamente
        if (!nuevoMunicipio) {
            return res.status(500).json({ msg: 'Error al crear el municipio' });
        }

        // Retornar el municipio creado
        return res.status(201).json({
            msg: 'Municipio creado exitosamente',
            data: nuevoMunicipio
        });

    } catch (error) {
        console.error('Error al crear el municipio:', error);
        return res.status(500).json({
            msg: 'Error al crear el municipio',
            error: error.message,
            stack: error.stack
        });
    }
};

exports.updateMunicipio = async (req, res) => {
    const { id } = req.params;
    const { nombre, latitude, longitude } = req.body;

    try {
        const municipio = await db.municipios.findByPk(id);
        if (!municipio) {
            return res.status(404).json({ msg: 'Municipio no encontrado' });
        }

        municipio.nombre = nombre || municipio.nombre;
        municipio.latitude = latitude || municipio.latitude;
        municipio.longitude = longitude || municipio.longitude;

        await municipio.save();
        res.json(municipio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el municipio' });
    }
};

exports.deleteMunicipio = async (req, res) => {
    const { id } = req.params;

    try {
        const municipio = await db.municipios.findByPk(id);
        if (!municipio) {
            return res.status(404).json({ msg: 'Municipio no encontrado' });
        }

        await municipio.destroy();
        res.json({ msg: 'Municipio eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar el municipio' });
    }
};
