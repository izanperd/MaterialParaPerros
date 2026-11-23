
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Tokens = require("../models/Tokens");

// Crear un error con un código HTTP.
const createError = (message, status) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

// Convertir el token en un hash para guardarlo en MongoDB.
const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};

// Crear el access token y el refresh token.
const createTokenPair = async (user, familyId) => {

    // Comprobar que existan las claves secretas.
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
        throw new Error("Faltan las claves JWT en el archivo .env");
    }

    // Crear el token para acceder a las rutas.
    const accessToken = jwt.sign(
        {
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            subject: user._id.toString(),
            expiresIn: "15m"
        }
    );

    // Crear un identificador único para el refresh token.
    const tokenId = crypto.randomUUID();

    // Crear el token para renovar la sesión.
    const refreshToken = jwt.sign(
        {
            familyId
        },
        process.env.JWT_REFRESH_SECRET,
        {
            subject: user._id.toString(),
            jwtid: tokenId,
            expiresIn: "7d"
        }
    );

    // Calculamos la fecha de caducidad.
    const decoded = jwt.decode(refreshToken);
    const expiresAt = new Date(decoded.exp * 1000);

    // Guardamos únicamente el hash del refresh token.
    const tokenHash = hashToken(refreshToken);

    await Tokens.create({
        userId: user._id,
        tokenHash,
        familyId,
        expiresAt
    });

    // Devolvemos los tokens y el hash para uso interno.
    return {
        accessToken,
        refreshToken,
        tokenHash
    };
};

// Iniciar sesión.
const login = async (data) => {

    // Comprobar los datos recibidos.
    if (!data.email || !data.password) {
        throw createError("Introduce el email y la contraseña", 400);
    }

    // Buscar el usuario y obtener su contraseña cifrada.
    const user = await User.findOne({
        email: data.email.trim().toLowerCase()
    }).select("+passwordHash");

    // Comprobar que el usuario exista y esté activo.
    if (!user || !user.active) {
        throw createError("Email o contraseña incorrectos", 401);
    }

    // Comprobar la contraseña.
    const passwordCorrect = await bcrypt.compare(
        data.password,
        user.passwordHash
    );

    if (!passwordCorrect) {
        throw createError("Email o contraseña incorrectos", 401);
    }

    // Cada inicio de sesión crea una sesión nueva.
    const familyId = crypto.randomUUID();

    // Crear los dos tokens.
    const tokens = await createTokenPair(user, familyId);

    // Devolver los tokens y los datos del usuario.
    return {
        user: user.toJSON(),
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
    };
};

// Renovar los tokens utilizando el refresh token.
const refresh = async (refreshToken) => {

    // Comprobar que se haya enviado el token.
    if (!refreshToken) {
        throw createError("Falta el refresh token", 400);
    }

    let payload;

    // Comprobar que el token sea válido.
    try {
        payload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );
    } catch (error) {
        throw createError("Refresh token inválido o caducado", 401);
    }

    // Buscar el token en MongoDB mediante su hash.
    const tokenHash = hashToken(refreshToken);
    const now = new Date();

    // Intentamos invalidarlo de forma atómica.
    // Así evitamos que dos peticiones utilicen el mismo token.
    const oldToken = await Tokens.findOneAndUpdate(
        {
            tokenHash,
            revokedAt: null,
            expiresAt: { $gt: now }
        },
        {
            $set: { revokedAt: now }
        },
        {
            new: true
        }
    );

    // Si no se ha podido utilizar, comprobamos el motivo.
    if (!oldToken) {

        const storedToken = await Tokens.findOne({ tokenHash });

        // Si ya estaba invalidado, detectamos una reutilización.
        if (storedToken && storedToken.revokedAt) {

            // Invalidamos los demás tokens activos de esa sesión.
            await Tokens.updateMany(
                {
                    familyId: storedToken.familyId,
                    revokedAt: null
                },
                {
                    $set: { revokedAt: now }
                }
            );

            throw createError(
                "Se ha reutilizado un refresh token antiguo. La sesión ha sido invalidada",
                401
            );
        }

        // Si no existe o ha caducado, rechazamos la petición.
        throw createError("Refresh token inválido o caducado", 401);
    }

    // Comprobar que el token pertenece al usuario indicado.
    if (
        oldToken.userId.toString() !== payload.sub ||
        oldToken.familyId !== payload.familyId
    ) {
        await Tokens.updateMany(
            {
                familyId: oldToken.familyId,
                revokedAt: null
            },
            {
                $set: { revokedAt: now }
            }
        );

        throw createError("Refresh token no válido", 401);
    }

    // Comprobar que el usuario sigue existiendo y está activo.
    const user = await User.findById(payload.sub);

    if (!user || !user.active) {
        await Tokens.updateMany(
            {
                familyId: oldToken.familyId,
                revokedAt: null
            },
            {
                $set: { revokedAt: now }
            }
        );

        throw createError("El usuario no está disponible", 401);
    }

    // Crear una pareja de tokens nueva para la misma sesión.
    const newTokens = await createTokenPair(user, oldToken.familyId);

    // Guardar qué token sustituye al anterior.
    oldToken.replacedByTokenHash = newTokens.tokenHash;
    await oldToken.save();

    // Devolver los nuevos tokens.
    return {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken
    };
};

// Cerrar sesión e invalidar los tokens de esa sesión.
const logout = async (refreshToken) => {

    // Comprobar que se haya enviado el token.
    if (!refreshToken) {
        throw createError("Falta el refresh token", 400);
    }

    let payload;

    // Comprobar que el refresh token sea válido.
    try {
        payload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );
    } catch (error) {
        throw createError("Refresh token inválido o caducado", 401);
    }

    // Buscar el token en MongoDB.
    const tokenHash = hashToken(refreshToken);
    const storedToken = await Tokens.findOne({ tokenHash });

    if (!storedToken) {
        throw createError("Refresh token no encontrado", 401);
    }

    // Comprobar que pertenece a la sesión correcta.
    if (
        storedToken.userId.toString() !== payload.sub ||
        storedToken.familyId !== payload.familyId
    ) {
        throw createError("Refresh token no válido", 401);
    }

    // Invalidar todos los tokens activos de esa sesión.
    await Tokens.updateMany(
        {
            familyId: storedToken.familyId,
            revokedAt: null
        },
        {
            $set: { revokedAt: new Date() }
        }
    );

    return {
        message: "Sesión cerrada correctamente"
    };
};

// Exportamos las funciones.
module.exports = {
    login,
    refresh,
    logout
};
