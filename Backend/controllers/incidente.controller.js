const db = require("../models");

exports.listIncidentes = async (req, res) => {
    try {
        const incidentes = await db.incidentes.findAll({
            include: { model: db.carreteras, as: 'carretera' }
        });
        res.json(incidentes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al listar incidentes' });
    }
};

exports.createIncidente = async (req, res) => {
    try {
        const { tipo, descripcion, ubicacion, carretera_id } = req.body;

        if (!tipo || !ubicacion || !carretera_id) {
            return res.status(400).json({ message: "Faltan datos requeridos" });
        }

        // Validación de coordenadas
        const { lat, lng } = ubicacion;
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            return res.status(400).json({ message: "Coordenadas inválidas" });
        }

        const carretera = await db.carreteras.findByPk(carretera_id);
        if (!carretera) {
            return res.status(404).json({ message: "Carretera no encontrada" });
        }

        const incidente = await db.incidentes.create({
            tipo,
            descripcion,
            ubicacion,
            carretera_id
        });

        res.status(201).json(incidente);
    } catch (error) {
        console.error('Error al crear incidente:', error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.updateIncidente = async (req, res) => {
    const { id } = req.params;
    const { tipo, descripcion, fecha, ubicacion, carretera_id } = req.body;

    try {
        const incidente = await db.incidentes.findByPk(id);
        if (!incidente) {
            return res.status(404).json({ msg: 'Incidente no encontrado' });
        }

        incidente.tipo = tipo || incidente.tipo;
        incidente.descripcion = descripcion || incidente.descripcion;
        incidente.fecha = fecha || incidente.fecha;
        incidente.ubicacion = ubicacion || incidente.ubicacion;
        incidente.carretera_id = carretera_id || incidente.carretera_id;

        await incidente.save();
        res.json(incidente);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el incidente' });
    }
};

exports.deleteIncidente = async (req, res) => {
    const { id } = req.params;

    try {
        const incidente = await db.incidentes.findByPk(id);
        if (!incidente) {
            return res.status(404).json({ msg: 'Incidente no encontrado' });
        }

        await incidente.destroy();
        res.json({ msg: 'Incidente eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar el incidente' });
    }
};
