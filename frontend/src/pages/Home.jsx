
function Home() {
  // Productos que mostramos en la tienda
  const productos = [
    { nombre: "Arnés táctico", precio: "35 €" },
    { nombre: "Correa operativa", precio: "20 €" },
    { nombre: "Chaleco de protección", precio: "50 €" }
  ];

  return (
    <div>
      <section className="inicio">
        <h1>Material para Perros</h1>
        <p>Equipamiento resistente para perros operativos</p>
        <a href="#productos">Ver productos</a>
      </section>

      <section id="productos">
        <h2>Nuestros productos</h2>

        <div className="productos">
          {productos.map((producto, index) => (
            <div className="producto" key={index}>
              <h3>{producto.nombre}</h3>
              <p>{producto.precio}</p>
              <button>Ver producto</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
