export interface Maestro {
  idMaestro: number;
  nombre: string;
  aPaterno: string;
  aMaterno: string;
  fecRegistro: string;
}

// Se usa tanto para Crear como para Actualizar (idMaestro va en la ruta)
export interface MaestroDTO {
  nombre: string;
  aPaterno: string;
  aMaterno: string;
}
