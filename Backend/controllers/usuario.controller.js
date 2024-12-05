const db = require("../models");
const bcrypt = require("bcrypt");
const { isRequestValid, sendError500 } = require("../utils/request.utils");


// Listar todos los usuarios
exports.listUsuarios = async (req, res) => {
    try {
        const usuarios = await db.usuarios.findAll();
        res.json(usuarios);
    } catch (error) {
        sendError500(error, res);
    }
};

// Obtener un usuario por ID
exports.getUsuarioById = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await getUsuarioOr404(id, res);
        if (!usuario) {
            return;
        }
        res.json(usuario);
    } catch (error) {
        sendError500(error, res);
    }
};

// Crear un nuevo usuario
exports.createUsuario = async (req, res) => {
    const requiredFields = ["email", "password", "role"];
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }

    try {
        const email = req.body.email;
        const usuarioExistente = await db.usuarios.findOne({
            where: { email: email },
        });

        if (usuarioExistente) {
            return res.status(400).json({ msg: "El email ya está registrado" });
        }

        // Hashear la contraseña con bcrypt
        const hashedPassword = await bcrypt.hash(req.body.password, 10);  // Aquí usamos bcrypt

        const usuario = {
            email: req.body.email,
            password: hashedPassword,  // Almacena la contraseña hasheada con bcrypt
            role: req.body.role, // Asigna el rol
        };

        const usuarioCreado = await db.usuarios.create(usuario);
        const usuarioRespuesta = await db.usuarios.findByPk(usuarioCreado.id);

        res.status(201).json(usuarioRespuesta);
    } catch (error) {
        sendError500(error, res);
    }
};
// Actualizar usuario (PATCH)
exports.updateUsuarioPatch = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await getUsuarioOr404(id, res);
        if (!usuario) {
            return;
        }
        const email = req.body.email;
        const usuarioExistente = await db.usuarios.findOne({
            where: { email: email }
        });
        if (usuarioExistente && usuarioExistente.id !== usuario.id) {
            return res.status(400).json({ msg: 'El email ya está registrado' });
        }
        usuario.email = req.body.email || usuario.email;

        await usuario.save();
        res.json(usuario);
    } catch (error) {
        sendError500(error, res);
    }
};

// Actualizar usuario (PUT)
exports.updateUsuarioPut = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await getUsuarioOr404(id, res);
        if (!usuario) {
            return;
        }

        const requiredFields = ['email'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }

        const email = req.body.email;
        const usuarioExistente = await db.usuarios.findOne({
            where: { email: email }
        });
        if (usuarioExistente && usuarioExistente.id !== usuario.id) {
            return res.status(400).json({ msg: 'El email ya está registrado' });
        }
        usuario.email = req.body.email;

        await usuario.save();
        res.json(usuario);
    } catch (error) {
        sendError500(error, res);
    }
};

// Eliminar un usuario
exports.deleteUsuario = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await getUsuarioOr404(id, res);
        if (!usuario) {
            return;
        }
        await usuario.destroy();
        res.json({ msg: 'Usuario eliminado correctamente' });
    } catch (error) {
        sendError500(error, res);
    }
};

// Cambiar la contraseña de un usuario
exports.changePassword = async (req, res) => {
    const { id } = req.params; // ID del usuario
    const { newPassword } = req.body; // Nueva contraseña

    if (!newPassword) {
        return res.status(400).json({ msg: 'La nueva contraseña es requerida' });
    }

    try {
        const usuario = await db.usuarios.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        usuario.password = hashedPassword;
        await usuario.save();

        res.json({ msg: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor al cambiar la contraseña' });
    }
};

// Función auxiliar para verificar si el usuario existe
async function getUsuarioOr404(id, res) {
    const usuario = await db.usuarios.findByPk(id);
    if (!usuario) {
        res.status(404).json({ msg: 'Usuario no encontrado' });
        return null;  // Retorna null en caso de que no se encuentre el usuario
    }
    return usuario;  // Retorna el usuario si existe
}
