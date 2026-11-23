
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  // Guardamos el correo y la contraseña
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate();

  // Comprobamos los datos con el backend
  const iniciarSesion = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch("http://localhost:3003/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.message || "Correo o contraseña incorrectos");
        return;
      }

      // Guardamos el token que devuelve el backend
      const token = datos.data?.token || datos.token;

      if (token) {
        localStorage.setItem("token", token);
      }

      setMensaje("Inicio de sesión correcto");

      // Entramos en la página principal
      navigate("/");

    } catch (error) {
      setMensaje("No se ha podido conectar con el servidor");
    }
  };

  return (
    <div className="formulario">
      <h1>Iniciar sesión</h1>
      <p>Accede a tu cuenta</p>

      <form onSubmit={iniciarSesion}>
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

        <button type="submit">Entrar</button>
      </form>

      <p>{mensaje}</p>
    </div>
  );
}

export default Login;
