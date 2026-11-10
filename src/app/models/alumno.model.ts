export interface Alumno {
  idAlumno: number;
  nombre: string;
  aPaterno: string;
  aMaterno: string;
  idCarrera: number;
  fecRegistro: string;
  carrera: string;
}

// Se usa tanto para Crear como para Actualizar (idAlumno va en la ruta)
export interface AlumnoDTO {
  nombre: string;
  aPaterno: string;
  aMaterno: string;
  idCarrera: number;
}
