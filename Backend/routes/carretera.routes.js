const express = require("express");
const router = express.Router();
const carreteraController = require("../controllers/carretera.controller.js");
const { verifyToken, isAdmin, isVerificador } = require("../middlewares/auth.middleware.js");

// Crear, listar, actualizar y eliminar carreteras
router.get("/", verifyToken, isVerificador, carreteraController.listCarreteras);  // Verificar con verificador
router.post("/", verifyToken, isVerificador, carreteraController.createCarretera); // Crear con verificador
router.put("/:id", verifyToken, isVerificador, carreteraController.updateCarretera); // Actualizar con verificador
router.delete("/:id", verifyToken, isVerificador, carreteraController.deleteCarretera); // Eliminar con verificador


module.exports = app => {
    app.use("/api/carreteras", router);
};
