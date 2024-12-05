const db = require("../models");

exports.listCarreteras = async (req, res) => {
    try {
        const { municipioOrigenId, municipioDestinoId } = req.query;

        const whereConditions = {};

        if (municipioOrigenId) {
            whereConditions.municipio_origen_id = municipioOrigenId;
        }

        if (municipioDestinoId) {
            whereConditions.municipio_destino_id = municipioDestinoId;
        }

        const carreteras = await db.carreteras.findAll({
            where: whereConditions,
            include: [
                {
                    model: db.municipios,
                    as: "municipioOrigen",
                    attributes: ['id', 'nombre']
                },
                {
                    model: db.municipios,
                    as: "municipioDestino",
                    attributes: ['id', 'nombre']
                }
            ]
        });

        res.json(carreteras);
    } catch (error) {
        console.error('Error al listar carreteras:', error);
        res.status(500).json({ msg: 'Error al listar las carreteras' });
    }
};



// Validación de datos antes de crear la carretera
exports.createCarretera = async (req, res) => {
    try {
    const { nombre, municipio_origen_id, municipio_destino_id, ruta_puntos, estado } = req.body;

    if (!nombre || !municipio_origen_id || !municipio_destino_id || !ruta_puntos || !estado) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

      // Validar que los municipios existen
    const municipioOrigen = await db.municipios.findByPk(municipio_origen_id);
    const municipioDestino = await db.municipios.findByPk(municipio_destino_id);

    if (!municipioOrigen || !municipioDestino) {
        return res.status(404).json({ message: "Municipio de origen o destino no encontrado" });
    }

      // Crear la carretera
    const carretera = await db.carreteras.create({
        nombre,
        municipio_origen_id,
        municipio_destino_id,
        ruta_puntos,
        estado
    });

    return res.status(201).json(carretera);
    } catch (error) {
    console.error("Error al crear la carretera", error);
    return res.status(500).json({ message: "Error interno del servidor" });
    }
};


exports.updateCarretera = async (req, res) => {
    const { id } = req.params;
    const { nombre, municipio_origen_id, municipio_destino_id, estado, motivo_bloqueo, ruta_puntos } = req.body;

    try {
        const carretera = await db.carreteras.findByPk(id);
        if (!carretera) {
            return res.status(404).json({ msg: 'Carretera no encontrada' });
        }

        carretera.nombre = nombre || carretera.nombre;
        carretera.municipio_origen_id = municipio_origen_id || carretera.municipio_origen_id;
        carretera.municipio_destino_id = municipio_destino_id || carretera.municipio_destino_id;
        carretera.estado = estado || carretera.estado;
        carretera.motivo_bloqueo = motivo_bloqueo || carretera.motivo_bloqueo;
        carretera.ruta_puntos = ruta_puntos || carretera.ruta_puntos;
        carretera.modificadoPor = req.user.id;
        carretera.modificadoEn = new Date();

        await carretera.save();
        res.json(carretera);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar la carretera' });
    }
};

exports.deleteCarretera = async (req, res) => {
    const { id } = req.params;

    try {
        const carretera = await db.carreteras.findByPk(id);
        if (!carretera) {
            return res.status(404).json({ msg: 'Carretera no encontrada' });
        }

        await carretera.destroy();
        res.json({ msg: 'Carretera eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar la carretera' });
    }
};
