module.exports = (sequelize, Sequelize) => {
    const Incidente = sequelize.define("incidente", {
        tipo: {
            type: Sequelize.ENUM(
                'transitable_con_desvios',
                'no_transitable_conflictos_sociales',
                'restriccion_vehicular',
                'no_transitable_trafico_cerrado',
                'restriccion_vehicular_especial'
            ),
            allowNull: false
        },
        descripcion: {
            type: Sequelize.STRING,
            allowNull: true
        },
        fecha: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        ubicacion: {
            type: Sequelize.JSON, // Cambiado de JSONB a JSON
            allowNull: false
        },
        carretera_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'carreteras',
                key: 'id'
            }
        }
    });

    Incidente.belongsTo(sequelize.models.carretera, { foreignKey: 'carretera_id', as: 'carretera' });

    return Incidente;
};
