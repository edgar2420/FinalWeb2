module.exports = app => {
    require("./usuario.routes")(app); // Rutas de usuarios
    require("./carretera.routes")(app); // Rutas de carreteras
    require("./municipio.routes")(app); // Rutas de municipios
    require("./incidente.routes")(app); // Rutas de incidentes
    require("./foto.routes")(app); // Rutas de fotos de incidentes
    require("./auth.routes")(app); // Rutas de autenticación
};
