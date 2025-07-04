const db = require('../models');

exports.verifyToken = async (req, res, next) => {
    try {
        console.log('Verificando el token');  // Log para ver si pasa por aquí
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        const [bearer, token] = authorization.split(" ");

        if (bearer !== "Bearer" || !token) {
            return res.status(401).json({ message: "Unauthorized - Invalid token format" });
        }

        const authToken = await db.auth_tokens.findOne({ where: { token } });

        if (!authToken) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        const usuario = await db.usuarios.findByPk(authToken.usuarioId);

        if (!usuario) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        req.user = usuario;  // Asignamos el usuario a la solicitud
        next();  // Pasar al siguiente middleware o ruta
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
    }
};


exports.isVerificador = (req, res, next) => {
    try {
        console.log('User role:', req.user ? req.user.role : 'No user');  // Log del rol del usuario

        if (req.user.role !== "verificador" && req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden - Access denied" });
        }
        next();  // Si el usuario es verificador o admin, pasa al siguiente middleware
    } catch (error) {
        console.error('Authorization error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden - Access denied" });
        }
        next();
    } catch (error) {
        console.error("Authorization error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};