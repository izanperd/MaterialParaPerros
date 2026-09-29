# ADR-002: Estructura inicial del proyecto

## Contexto

El proyecto está compuesto por un frontend y un backend que forman parte de la misma aplicación.

Necesitamos decidir cómo organizar ambos componentes dentro del repositorio para facilitar el desarrollo y el mantenimiento del proyecto.

## Decisión

Utilizaremos un único repositorio con una estructura de monorepo.

El proyecto estará organizado de la siguiente manera:

- `frontend/`: aplicación frontend.
- `backend/`: aplicación backend.
- `docker/`: configuración relacionada con Docker.
- `.gitignore`: archivos y carpetas que no deben incluirse en Git.
- `README.md`: documentación general del proyecto.

## Consecuencias

### Positivas

- Frontend y backend están centralizados en un mismo repositorio.
- Es más sencillo gestionar el proyecto completo.
- La estructura permite separar claramente frontend y backend.
- La configuración de Docker queda centralizada.

### Negativas

- El repositorio contiene tanto frontend como backend.
- El repositorio puede crecer más que si cada parte estuviera separada.
- Los cambios de frontend y backend se gestionan dentro del mismo repositorio.