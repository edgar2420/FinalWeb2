const express = require("express");
const router = express.Router();
const fotoController = require("../controllers/foto.controller.js");
const { verifyToken, isVerificador } = require("../middlewares/auth.middleware.js");

// Subir y eliminar fotos
router.post("/:incidenteId", verifyToken, isVerificador, fotoController.uploadFoto);  // Verificar con verificador
router.delete("/:fotoId", verifyToken, isVerificador, fotoController.deleteFoto);  // Verificar con verificador


module.exports = app => {
    app.use("/api/fotos", router);
};
