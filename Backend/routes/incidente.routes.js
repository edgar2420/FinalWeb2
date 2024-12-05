const express = require("express");
const router = express.Router();
const incidenteController = require("../controllers/incidente.controller.js");
const { verifyToken, isAdmin, isVerificador } = require("../middlewares/auth.middleware.js");

// Crear, listar, actualizar y eliminar incidentes
router.get("/", verifyToken, isVerificador, incidenteController.listIncidentes);  // Verificar con verificador
router.post("/", verifyToken, isVerificador, incidenteController.createIncidente); // Crear con verificador
router.put("/:id", verifyToken, isVerificador, incidenteController.updateIncidente); // Actualizar con verificador
router.delete("/:id", verifyToken, isVerificador, incidenteController.deleteIncidente); // Eliminar con verificador


module.exports = app => {
    app.use("/api/incidentes", router);
};
