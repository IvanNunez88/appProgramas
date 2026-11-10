# Programas FACPYA - App móvil

Aplicación móvil en **Ionic 8 + Angular 20 + Capacitor 8** que administra Alumnos, Maestros y Carreras con la API `ProgramasFacpya.Api`. Es el ejemplo terminado de la actividad; la versión para alumnos está en `appProgramas-cascaron`.

## Cómo correrlo

1. Levanta la API, que escucha en `http://localhost:5165`.
2. Instala las dependencias (solo la primera vez):
   ```
   npm install
   ```
3. Levanta la app con **F5** en VS Code (abre Chrome solo) o desde la terminal:
   ```
   npm start
   ```
4. Si usaste la terminal, abre http://localhost:4200. Después activa la vista de celular en las herramientas de desarrollador del navegador (F12).

## Estructura

```
src/
├── environments/environment.ts   URL de la API
└── app/
    ├── tabs/                     Barra de pestañas y sus rutas
    ├── models/                   Interfaces de los datos
    ├── services/                 Una clase por controlador de la API
    └── pages/
        ├── inicio/
        ├── alumnos/              Formulario con ion-modal e ion-select
        ├── maestros/             Formulario con ion-modal
        └── carreras/             Formulario con AlertController
```
