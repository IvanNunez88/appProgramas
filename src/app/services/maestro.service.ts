import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Maestro, MaestroDTO } from '../models/maestro.model';

@Injectable({
  providedIn: 'root',
})
export class MaestroService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.endpoint}Maestro`;

  obtenerTodos(): Observable<ApiResponse<Maestro[]>> {
    return this.http.get<ApiResponse<Maestro[]>>(`${this.baseUrl}/ObtenerTodos`);
  }

  obtenerPorId(idMaestro: number): Observable<ApiResponse<Maestro>> {
    return this.http.get<ApiResponse<Maestro>>(`${this.baseUrl}/ObtenerPorId/${idMaestro}`,);
  }

  crear(dto: MaestroDTO): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(`${this.baseUrl}/Crear`, dto);
  }

  actualizar(idMaestro: number, dto: MaestroDTO,): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.baseUrl}/Actualizar/${idMaestro}`,dto,);
  }

  eliminar(idMaestro: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/Eliminar/${idMaestro}`,);
  }
}
