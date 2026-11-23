
import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/login">Iniciar sesion</Link>
        <Link to="/register">Registrarse</Link>
      </nav>

      <Outlet />
    </div>
  );
}

export default App;
