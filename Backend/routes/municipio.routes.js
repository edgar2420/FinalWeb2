const express = require('express');
const router = express.Router();
const municipioController = require("../controllers/municipio.controller.js");
const { verifyToken, isVerificador } = require("../middlewares/auth.middleware.js");

// Crear municipio
router.post('/crear', verifyToken, isVerificador, municipioController.createMunicipio);

// Otras rutas de municipios
router.get("/", verifyToken, isVerificador, municipioController.listMunicipios);
router.put("/:id", verifyToken, isVerificador, municipioController.updateMunicipio);
router.delete("/:id", verifyToken, isVerificador, municipioController.deleteMunicipio);

module.exports = app => {
    app.use("/api/municipios", router); // Verifica que las rutas sean correctas aquí
};
