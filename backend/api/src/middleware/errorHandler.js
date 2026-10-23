
const mongoose = require("mongoose");

// Este middleware recibe los errores de los controladores y servicios.
const errorHandler = (error, req, res, next) => {
    // Si la respuesta ya se ha enviado, dejamos que Express gestione el error.
    if (res.headersSent) {
        return next(error);
    }

    let status = error.status || 500;
    let code = "INTERNAL_SERVER_ERROR";
    let message = "Ha ocurrido un error interno";
    let details = [];

    // El ID no tiene el formato correcto.
    if (error instanceof mongoose.Error.CastError) {
        status = 400;
        code = "INVALID_ID";
        message = "El identificador no es válido";
    }

    // Los datos no cumplen las reglas del modelo.
    else if (error instanceof mongoose.Error.ValidationError) {
        status = 422;
        code = "VALIDATION_ERROR";
        message = "Los datos no son válidos";

        details = Object.values(error.errors).map((item) => ({
            field: item.path,
            message: item.message
        }));
    }

    // Se ha intentado repetir un valor único, como un email o un slug.
    else if (error.code === 11000) {
        status = 409;
        code = "DUPLICATE_VALUE";
        message = "Ese valor ya existe";
        details = Object.keys(error.keyValue || {}).map((field) => ({
            field,
            message: "Este valor debe ser único"
        }));
    }

    // Errores controlados, por ejemplo una contraseña demasiado corta.
    else if (error.status === 400) {
        status = 400;
        code = "BAD_REQUEST";
        message = error.message;
    }

    // Enviamos una respuesta clara sin enseñar detalles internos del servidor.
    res.status(status).json({
        success: false,
        error: {
            code,
            message,
            details
        }
    });
};

module.exports = errorHandler;
