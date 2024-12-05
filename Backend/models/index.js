const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar modelos
db.usuarios = require("./usuario.model.js")(sequelize, Sequelize);
db.municipios = require("./municipio.model.js")(sequelize, Sequelize);
db.carreteras = require("./carretera.model.js")(sequelize, Sequelize);
db.incidentes = require("./incidente.model.js")(sequelize, Sequelize);
db.fotos_incidente = require("./foto_incidente.model.js")(sequelize, Sequelize);
db.solicitudes_incidente = require("./solicitud_incidente.model.js")(sequelize, Sequelize);
db.auth_tokens = require("./auth_token.model.js")(sequelize, Sequelize);

// Relación Usuario - AuthToken (Uno a Muchos)
db.usuarios.hasMany(db.auth_tokens, { as: "tokens" });
db.auth_tokens.belongsTo(db.usuarios, { foreignKey: "usuarioId", as: "usuario" });

// Relación Carretera - Municipio (Muchos a Uno)
db.carreteras.belongsTo(db.municipios, { foreignKey: "municipio_origen_id", as: "municipioOrigen" });
db.carreteras.belongsTo(db.municipios, { foreignKey: "municipio_destino_id", as: "municipioDestino" });
db.municipios.hasMany(db.carreteras, { foreignKey: "municipio_origen_id", as: "carreterasOrigen" });
db.municipios.hasMany(db.carreteras, { foreignKey: "municipio_destino_id", as: "carreterasDestino" });

// Relación Carretera - Incidente (Uno a Muchos)
db.carreteras.hasMany(db.incidentes, { as: "incidentesCarretera" });
db.incidentes.belongsTo(db.carreteras, { foreignKey: "carretera_id", as: "carreteraIncidente" });

// Relación Incidente - FotoIncidente (Uno a Muchos)
db.incidentes.hasMany(db.fotos_incidente, { as: "fotosIncidente" });
db.fotos_incidente.belongsTo(db.incidentes, { foreignKey: "incidente_id", as: "fotoDeIncidente" });

// Relación Municipio - SolicitudIncidente (Uno a Muchos)
db.municipios.hasMany(db.solicitudes_incidente, { as: "solicitudesMunicipio" });
db.solicitudes_incidente.belongsTo(db.municipios, { foreignKey: "municipio_id", as: "solicitudDeMunicipio" });

// Auditoría de cambios en Carretera
db.carreteras.belongsTo(db.usuarios, { foreignKey: "modificadoPor", as: "usuarioModificador" });

module.exports = db;
