import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Alumno, AlumnoDTO } from '../models/alumno.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AlumnoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.endpoint}Alumno`;

  obtenerTodos(): Observable<ApiResponse<Alumno[]>> {
    return this.http.get<ApiResponse<Alumno[]>>(`${this.baseUrl}/ObtenerTodos`);
  }

  obtenerPorId(idAlumno: number): Observable<ApiResponse<Alumno>> {
    return this.http.get<ApiResponse<Alumno>>(`${this.baseUrl}/ObtenerPorId/${idAlumno}`,);
  }

  crear(dto: AlumnoDTO): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(`${this.baseUrl}/Crear`, dto);
  }

  actualizar(idAlumno: number,dto: AlumnoDTO,): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.baseUrl}/Actualizar/${idAlumno}`,dto,);
  }

  eliminar(idAlumno: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/Eliminar/${idAlumno}`,);
  }
}
