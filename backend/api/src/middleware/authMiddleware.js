
const jwt = require("jsonwebtoken");

// Comprobar el access token antes de entrar en una ruta.
const authMiddleware = (req, res, next) => {

    // Recoger el token de la cabecera Authorization.
    const authHeader = req.headers.authorization;

    // Comprobar que se haya enviado el token.
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const error = new Error("No has enviado el access token");
        error.status = 401;
        return next(error);
    }

    // Quitar la palabra Bearer y quedarnos con el token.
    const token = authHeader.split(" ")[1];

    try {
        // Comprobar que el token sea correcto y no haya caducado.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Guardar los datos del usuario para utilizarlos en el controlador.
        req.user = {
            id: decoded.sub,
            role: decoded.role
        };

        // Permitir que continúe la petición.
        next();

    } catch (error) {
        // Si el token falla, no permitimos entrar.
        const authError = new Error("Access token inválido o caducado");
        authError.status = 401;
        next(authError);
    }
};

// Exportar el middleware.
module.exports = authMiddleware;
