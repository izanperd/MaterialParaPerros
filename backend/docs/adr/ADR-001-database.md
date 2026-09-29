# ADR-001: Elección de la base de datos

## Contexto

El proyecto necesita una base de datos para almacenar la información de los usuarios, productos, categorías y pedidos.

## Decisión

Utilizaremos MongoDB como base de datos principal del proyecto.

MongoDB se ejecutará mediante Docker para facilitar su instalación y configuración durante el desarrollo.

## Consecuencias

### Positivas

- Flexibilidad para modificar la estructura de los documentos.
- Buena integración con Node.js y Express.
- Fácil ejecución mediante Docker.
- Permite almacenar documentos con estructuras flexibles.

### Negativas

- Las consultas con relaciones complejas pueden resultar menos adecuadas que en una base de datos relacional.
- Será necesario diseñar correctamente las relaciones entre los documentos.