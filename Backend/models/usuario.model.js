module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define("usuarios", {
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,  // Asegúrate de que `password` es obligatorio
        },
        role: {
            type: Sequelize.ENUM('admin', 'verificador', 'publico'),
            allowNull: false,
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        }
    });

    return Usuario;
};
