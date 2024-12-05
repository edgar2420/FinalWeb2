module.exports = (sequelize, Sequelize) => {
    const Carretera = sequelize.define("carretera", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        municipio_origen_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'municipios', key: 'id' },
        },
        municipio_destino_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'municipios', key: 'id' },
        },
        estado: {
            type: Sequelize.ENUM,
            values: ['libre', 'bloqueada'],
            defaultValue: 'libre',
        },
        motivo_bloqueo: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        ruta_puntos: {
            type: Sequelize.JSON, // Cambiado de JSONB a JSON para compatibilidad con MySQL
            allowNull: false,
        },
        modificadoPor: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: 'usuarios', key: 'id' }, // Relación con la tabla de usuarios
        },
        modificadoEn: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW, // Fecha del último cambio
        },
    });

    return Carretera;
};
