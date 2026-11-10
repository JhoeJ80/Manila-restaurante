import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ComidaApiService {
    obtenerPlatoEstrella(): Observable<any> {
      throw new Error('Method not implemented.');
    }
    private base = "https://www.themealdb.com/api/json/v1/1/";

    constructor(private servicioComida: HttpClient) { }

    recibirDatos(): Observable<any> {
        return this.servicioComida.get(`${this.base}search.php?s=a`);
    }

    buscarPorNombre(nombre: string): Observable<any> {
        return this.servicioComida.get(`${this.base}search.php?s=${nombre}`);
    }

    buscarPorIngrediente(ingrediente: string): Observable<any> {
        return this.servicioComida.get(`${this.base}filter.php?i=${ingrediente}`);
    }

    buscarPorId(id: string): Observable<any> {
        return this.servicioComida.get(`${this.base}lookup.php?i=${id}`);
    }

    categorias(): Observable<any> {
        return this.servicioComida.get(`${this.base}categories.php`);
    }

    comidasPorCategoria(categoria: string): Observable<any> {
        return this.servicioComida.get(`${this.base}filter.php?c=${categoria}`);
    }
}