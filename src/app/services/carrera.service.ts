import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Carrera, CarreraDTO } from '../models/carrera.model';

@Injectable({
  providedIn: 'root',
})
export class CarreraService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.endpoint}Carrera`;

  obtenerTodos(): Observable<ApiResponse<Carrera[]>> {
    return this.http.get<ApiResponse<Carrera[]>>(`${this.baseUrl}/ObtenerTodos`);
  }

  obtenerPorId(idCarrera: number): Observable<ApiResponse<Carrera>> {
    return this.http.get<ApiResponse<Carrera>>(`${this.baseUrl}/ObtenerPorId/${idCarrera}`,);
  }

  crear(dto: CarreraDTO): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(`${this.baseUrl}/Crear`, dto);
  }

  actualizar(idCarrera: number,dto: CarreraDTO,): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.baseUrl}/Actualizar/${idCarrera}`,dto,);
  }

  eliminar(idCarrera: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/Eliminar/${idCarrera}`,);
  }
}
