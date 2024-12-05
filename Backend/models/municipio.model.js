module.exports = (sequelize, Sequelize) => {
    const Municipio = sequelize.define("municipio", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        latitude: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        longitude: {
            type: Sequelize.FLOAT,
            allowNull: false
        }
    });

    return Municipio;
};
