
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BebidaApiService {

  private base = 'https://www.thecocktaildb.com/api/json/v1/1/';

  constructor(private servicioBebida: HttpClient) {}

  recibirDatos(): Observable<any> {
    return this.servicioBebida.get(`${this.base}search.php?s=a`);
  }

  obtenerCategorias(): Observable<any> {
    return this.servicioBebida.get(`${this.base}list.php?c=list`);
  }

  buscarPorNombre(nombre: string): Observable<any> {
    return this.servicioBebida.get(
      `${this.base}search.php?s=${encodeURIComponent(nombre)}`
    );
  }

  buscarPorIngrediente(ingrediente: string): Observable<any> {
    return this.servicioBebida.get(
      `${this.base}filter.php?i=${encodeURIComponent(ingrediente)}`
    );
  }

  buscarPorAlcohol(tipo: string): Observable<any> {
    return this.servicioBebida.get(
      `${this.base}filter.php?a=${encodeURIComponent(tipo)}`
    );
  }

  buscarPorCategoria(categoria: string): Observable<any> {
    return this.servicioBebida.get(
      `${this.base}filter.php?c=${encodeURIComponent(categoria)}`
    );
  }

  buscarPorId(id: string): Observable<any> {
    return this.servicioBebida.get(
      `${this.base}lookup.php?i=${encodeURIComponent(id)}`
    );
  }
}
