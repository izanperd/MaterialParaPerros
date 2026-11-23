
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  // Guardamos los datos del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate();

  // Enviamos los datos al backend
  const registrar = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch("http://localhost:3003/api/users/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.message || "Error al crear la cuenta");
        return;
      }

      setMensaje("Usuario registrado correctamente");

      // Vamos a la página de inicio de sesión
      setTimeout(() => navigate("/login"), 1000);

    } catch (error) {
      setMensaje("No se ha podido conectar con el servidor");
    }
  };

  return (
    <div className="formulario">
      <h1>Crear cuenta</h1>
      <p>Regístrate en Material para Perros</p>

      <form onSubmit={registrar}>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Registrarse</button>
      </form>

      <p>{mensaje}</p>
    </div>
  );
}

export default Register;
