
const mongoose = require("mongoose");

// Este archivo recibe y controla los errores de toda la API.
const errorHandler = (error, req, res, next) => {

    // Si ya hemos enviado una respuesta, dejamos continuar.
    if (res.headersSent) {
        return next(error);
    }

    let status = error.status || 500;
    let code = "INTERNAL_SERVER_ERROR";
    let message = "Ha ocurrido un error interno";
    let details = [];

    // Error cuando el ID de MongoDB no es válido.
    if (error instanceof mongoose.Error.CastError) {
        status = 400;
        code = "INVALID_ID";
        message = "El identificador no es válido";
    }

    // Error cuando faltan datos o no cumplen las reglas.
    else if (error instanceof mongoose.Error.ValidationError) {
        status = 422;
        code = "VALIDATION_ERROR";
        message = "Los datos no son válidos";

        details = Object.values(error.errors).map((item) => ({
            field: item.path,
            message: item.message
        }));
    }

    // Error cuando intentamos repetir un email o slug.
    else if (error.code === 11000) {
        status = 409;
        code = "DUPLICATE_VALUE";
        message = "Ese valor ya existe";

        details = Object.keys(error.keyValue || {}).map((field) => ({
            field,
            message: "Este valor ya está registrado"
        }));
    }

    // Error cuando faltan datos o son incorrectos.
    else if (error.status === 400) {
        status = 400;
        code = "BAD_REQUEST";
        message = error.message;
    }

    // Error cuando el usuario no ha podido iniciar sesión.
    else if (error.status === 401) {
        status = 401;
        code = "UNAUTHORIZED";
        message = error.message;
    }

    // Error cuando un usuario o recurso no existe.
    else if (error.status === 404) {
        status = 404;
        code = "NOT_FOUND";
        message = error.message;
    }

    // Error cuando un email ya está registrado.
    else if (error.status === 409) {
        status = 409;
        code = "CONFLICT";
        message = error.message;
    }

    // Mostramos el error en la terminal para poder revisarlo.
    console.error(error);

    // Enviamos una respuesta clara al usuario.
    res.status(status).json({
        success: false,
        error: {
            code,
            message,
            details
        }
    });
};

// Exportamos el middleware.
module.exports = errorHandler;
