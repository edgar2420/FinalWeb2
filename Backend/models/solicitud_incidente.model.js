module.exports = (sequelize, Sequelize) => {
    const SolicitudIncidente = sequelize.define("solicitud_incidente", {
        descripcion: {
            type: Sequelize.STRING,
            allowNull: false
        },
        foto_url: {
            type: Sequelize.STRING,
            allowNull: true
        },
        municipio_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'municipios',
                key: 'id'
            }
        },
        fecha_solicitud: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    });

    SolicitudIncidente.belongsTo(sequelize.models.municipio, { foreignKey: 'municipio_id', as: 'municipio' });

    return SolicitudIncidente;
};
