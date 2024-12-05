const db = require("../models");
const jwt = require('jsonwebtoken');


exports.userRequiredMiddleware = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        // Verifica que la cabecera Authorization exista
        if (!authorization) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        // Extrae el token de la cabecera (formato: Bearer <token>)
        const [bearer, token] = authorization.split(" ");
        
        if (bearer !== "Bearer" || !token) {
            return res.status(401).json({ message: "Unauthorized - Invalid token format" });
        }

        // Verifica si el token existe en la base de datos
        const authToken = await db.auth_tokens.findOne({ where: { token } });
        
        // Si no se encuentra el token, el acceso es denegado
        if (!authToken) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        // Si el token es válido, obtenemos el usuario asociado
        const usuario = await db.usuarios.findByPk(authToken.usuarioId);

        if (!usuario) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        // Adjuntamos el usuario a la solicitud para su uso posterior
        req.user = usuario;

        // Continuamos con el siguiente middleware o ruta
        next();

    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
    }
};

