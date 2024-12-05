module.exports = (sequelize, Sequelize) => {
    const FotoIncidente = sequelize.define("foto_incidente", {
        url: {
            type: Sequelize.STRING,
            allowNull: false
        },
        incidente_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'incidentes',
                key: 'id'
            }
        }
    });

    FotoIncidente.belongsTo(sequelize.models.incidente, { foreignKey: 'incidente_id', as: 'incidente' });

    return FotoIncidente;
};
