export interface Carrera {
  idCarrera: number;
  descripcion: string;
}

// Se usa tanto para Crear como para Actualizar (idCarrera va en la ruta)
export interface CarreraDTO {
  descripcion: string;
}
