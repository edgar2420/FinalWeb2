const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller.js");
const { verifyToken, isAdmin, isVerificador } = require("../middlewares/auth.middleware.js");

// Rutas para usuarios
router.get("/", verifyToken, isAdmin, usuarioController.listUsuarios); // Listar usuarios
router.get("/:id", verifyToken, isAdmin, usuarioController.getUsuarioById); // Obtener usuario por ID
router.post("/", verifyToken, isAdmin, usuarioController.createUsuario); // Crear usuario
router.put("/:id", verifyToken, isAdmin, usuarioController.updateUsuarioPut); // Actualizar usuario
router.patch("/:id/password", verifyToken, isAdmin, usuarioController.changePassword); // Cambiar contraseña del usuario
router.delete("/:id", verifyToken, isAdmin, usuarioController.deleteUsuario); // Eliminar usuario

module.exports = app => {
    app.use("/api/usuarios", router);
};
