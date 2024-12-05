const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller.js");
const { userRequiredMiddleware } = require("../middlewares/userRequiredMiddleware.js");

// Rutas para autenticación
router.post("/login", authController.login); // Login
router.post("/logout", userRequiredMiddleware, authController.logout); // Logout
router.get("/me", userRequiredMiddleware, authController.me); // Obtener usuario autenticado

module.exports = app => {
    app.use("/auth", router);
};
